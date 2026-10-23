import mongoose from 'mongoose';
import { ConversationMemory } from '../models/ConversationMemory.js';
import { logger } from '../utils/logger.js';

/**
 * User-Isolated Conversational Context & Memory Manager.
 * Maintains recent conversation turns, follow-up topics, and agent interactions
 * strictly partitioned by user ID to prevent cross-user memory leakage.
 * Combines ultra-fast in-memory hot cache with persistent MongoDB synchronization.
 */
class AIMemoryManager {
    constructor(maxTurnsPerUser = 10, ttlMs = 2 * 60 * 60 * 1000) {
        // Map<userId, { turns: Array<{ role, content, agent, timestamp }>, lastActive: number }>
        this.sessions = new Map();
        this.maxTurns = maxTurnsPerUser;
        this.ttl = ttlMs;
    }

    /**
     * Retrieves conversational history for a specific user from in-memory cache.
     * @param {string} userId - Unique identifier of the user
     * @param {number} limit - Maximum number of recent turns to retrieve
     * @returns {Array} List of recent conversation turns
     */
    getHistory(userId, limit = 5) {
        if (!userId) return [];
        const userIdStr = String(userId);
        const session = this.sessions.get(userIdStr);
        if (!session) return [];

        // Check if session has expired
        if (Date.now() - session.lastActive > this.ttl) {
            this.sessions.delete(userIdStr);
            return [];
        }

        return session.turns.slice(-limit);
    }

    /**
     * Asynchronously retrieves persistent conversational history from MongoDB,
     * populating the in-memory cache if missing.
     */
    async getPersistentHistory(userId, limit = 10) {
        if (!userId) return [];
        try {
            // Hot cache check: Return immediately if user has active turns in memory
            const inMemory = this.getHistory(userId, limit);
            if (inMemory && inMemory.length > 0) {
                return inMemory;
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) return inMemory || [];

            const memoryDoc = await ConversationMemory.findOne({
                user: new mongoose.Types.ObjectId(userId),
                isArchived: false,
            })
                .sort({ lastActive: -1 })
                .lean();

            if (!memoryDoc || !Array.isArray(memoryDoc.turns)) return inMemory || [];

            const turns = memoryDoc.turns.slice(-limit);

            // Populate in-memory hot cache
            this.sessions.set(String(userId), {
                turns,
                lastActive: Date.now(),
            });

            return turns;
        } catch (err) {
            logger.warn(`Failed to retrieve persistent memory for user ${userId}: ${err.message}`);
            return this.getHistory(userId, limit);
        }
    }

    /**
     * Records a new interaction turn in the user's isolated memory session,
     * maintaining in-memory hot cache and asynchronously persisting to MongoDB.
     * @param {string} userId - User identifier
     * @param {object} turnData - Turn details: { userQuery, agent, responseSummary, intent, title }
     */
    addTurn(userId, { userQuery, agent, responseSummary, intent, title }) {
        if (!userId) return;
        const userIdStr = String(userId);
        let session = this.sessions.get(userIdStr);

        if (!session || (Date.now() - session.lastActive > this.ttl)) {
            session = { turns: [], lastActive: Date.now() };
            this.sessions.set(userIdStr, session);
        }

        session.lastActive = Date.now();

        const newTurns = [];

        if (userQuery) {
            const userTurn = {
                role: 'user',
                content: String(userQuery).trim(),
                timestamp: new Date().toISOString(),
            };
            session.turns.push(userTurn);
            newTurns.push(userTurn);
        }

        if (responseSummary) {
            const assistantTurn = {
                role: 'assistant',
                agent: agent || 'assistant',
                intent: intent || 'general',
                content: typeof responseSummary === 'object'
                    ? JSON.stringify(responseSummary).slice(0, 500)
                    : String(responseSummary).slice(0, 500),
                timestamp: new Date().toISOString(),
            };
            session.turns.push(assistantTurn);
            newTurns.push(assistantTurn);
        }

        // Enforce max turns limit FIFO in-memory
        if (session.turns.length > this.maxTurns) {
            session.turns = session.turns.slice(-this.maxTurns);
        }

        // MongoDB persistence (safe fire-and-forget or awaitable)
        if (mongoose.Types.ObjectId.isValid(userId) && newTurns.length > 0) {
            return this._persistTurns(userId, newTurns, title).catch((err) => {
                logger.warn(`AI Memory persistence warning for user ${userId}: ${err.message}`);
                return null;
            });
        }
        return Promise.resolve(null);
    }

    /**
     * Internal helper to persist turns into active ConversationMemory document
     */
    async _persistTurns(userId, turns, title) {
        const userObjId = new mongoose.Types.ObjectId(userId);
        let conv = await ConversationMemory.findOne({
            user: userObjId,
            isArchived: false,
        }).sort({ lastActive: -1 });

        if (!conv) {
            conv = new ConversationMemory({
                user: userObjId,
                title: title || 'Academic AI Assistant Session',
                turns: [],
                lastActive: new Date(),
            });
        }

        for (const turn of turns) {
            conv.turns.push({
                role: turn.role,
                agent: turn.agent || 'assistant',
                intent: turn.intent || 'general',
                content: turn.content,
                timestamp: new Date(turn.timestamp || Date.now()),
            });
        }

        conv.lastActive = new Date();
        // Keep conversation bounded to last 30 turns in persistent DB storage
        if (conv.turns.length > 30) {
            conv.turns = conv.turns.slice(-30);
        }
        await conv.save();
    }

    /**
     * Retrieves all persistent conversation sessions for the authenticated user.
     */
    async listConversations(userId) {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return [];
        return ConversationMemory.find({
            user: new mongoose.Types.ObjectId(userId),
        })
            .select('title turns lastActive isArchived createdAt')
            .sort({ lastActive: -1 })
            .lean();
    }

    /**
     * Deletes or archives a specific conversation owned by the authenticated user.
     */
    async deleteConversation(userId, conversationId) {
        if (!userId || !conversationId) return false;
        if (!mongoose.Types.ObjectId.isValid(conversationId)) return false;

        const res = await ConversationMemory.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(conversationId),
            user: new mongoose.Types.ObjectId(userId),
        });

        // Also purge active memory if this was the current session
        this.clearHistory(userId);
        return !!res;
    }

    /**
     * Clears history for a user (e.g. upon logout or explicit reset)
     */
    async clearHistory(userId) {
        if (userId) {
            const userIdStr = String(userId);
            this.sessions.delete(userIdStr);

            if (mongoose.Types.ObjectId.isValid(userId)) {
                await ConversationMemory.updateMany(
                    { user: new mongoose.Types.ObjectId(userId), isArchived: false },
                    { $set: { isArchived: true } }
                ).catch(() => {});
            }
        }
    }

    /**
     * Periodic cleanup of expired sessions to prevent memory bloat
     */
    cleanup() {
        const now = Date.now();
        for (const [userId, session] of this.sessions.entries()) {
            if (now - session.lastActive > this.ttl) {
                this.sessions.delete(userId);
            }
        }
    }
}

export const memoryManager = new AIMemoryManager();

