/**
 * User-Isolated Conversational Context & Memory Manager.
 * Maintains recent conversation turns, follow-up topics, and agent interactions
 * strictly partitioned by user ID to prevent cross-user memory leakage.
 */
class AIMemoryManager {
    constructor(maxTurnsPerUser = 10, ttlMs = 2 * 60 * 60 * 1000) {
        // Map<userId, { turns: Array<{ role, content, agent, timestamp }>, lastActive: number }>
        this.sessions = new Map();
        this.maxTurns = maxTurnsPerUser;
        this.ttl = ttlMs;
    }

    /**
     * Retrieves conversational history for a specific user.
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
     * Records a new interaction turn in the user's isolated memory session.
     * @param {string} userId - User identifier
     * @param {object} turnData - Turn details: { userQuery, agent, responseSummary, intent }
     */
    addTurn(userId, { userQuery, agent, responseSummary, intent }) {
        if (!userId) return;
        const userIdStr = String(userId);
        let session = this.sessions.get(userIdStr);

        if (!session || (Date.now() - session.lastActive > this.ttl)) {
            session = { turns: [], lastActive: Date.now() };
            this.sessions.set(userIdStr, session);
        }

        session.lastActive = Date.now();

        if (userQuery) {
            session.turns.push({
                role: 'user',
                content: String(userQuery).trim(),
                timestamp: new Date().toISOString(),
            });
        }

        if (responseSummary) {
            session.turns.push({
                role: 'assistant',
                agent: agent || 'assistant',
                intent: intent || 'general',
                content: typeof responseSummary === 'object'
                    ? JSON.stringify(responseSummary).slice(0, 300)
                    : String(responseSummary).slice(0, 300),
                timestamp: new Date().toISOString(),
            });
        }

        // Enforce max turns limit FIFO
        if (session.turns.length > this.maxTurns) {
            session.turns = session.turns.slice(-this.maxTurns);
        }
    }

    /**
     * Clears history for a user (e.g. upon logout or explicit reset)
     */
    clearHistory(userId) {
        if (userId) {
            this.sessions.delete(String(userId));
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
