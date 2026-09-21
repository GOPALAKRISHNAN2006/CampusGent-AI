import { Request, Response, NextFunction } from 'express';
import { MockInterviewSession } from '../models/MockInterviewSession';
import { StudentProfile } from '../models/StudentProfile';
import { AIInsight } from '../models/AIInsight';
import { AIOrchestrator } from '../ai/orchestrator';
import { AIContextBuilder } from '../ai/context.builder';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import mongoose from 'mongoose';
import { env } from '../config/env';

// Sanitize student answers to mitigate prompt injection hijacking system instructions
const sanitizeAnswer = (answer: string): string => {
  return answer.replace(/<[^>]*>/g, '').trim();
};

export const startSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      throw new ForbiddenError('Authentication required');
    }

    const { type, jobId } = req.body;
    if (!type || !['TECHNICAL', 'BEHAVIORAL', 'HR', 'RESUME'].includes(type)) {
      throw new BadRequestError('Valid interview type is required');
    }

    const session = await MockInterviewSession.create({
      student: new mongoose.Types.ObjectId(studentId),
      job: jobId ? new mongoose.Types.ObjectId(jobId) : undefined,
      type,
      status: 'STARTED',
      turns: [],
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export const generateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { id } = req.params;

    const session = await MockInterviewSession.findById(id);
    if (!session) {
      throw new NotFoundError('Mock interview session not found');
    }

    if (session.student.toString() !== studentId) {
      throw new ForbiddenError('Unauthorized to access this interview session');
    }

    if (session.status === 'COMPLETED') {
      throw new BadRequestError('Interview session is already completed');
    }

    // Compile Context Snapshot
    const snapshot = await AIContextBuilder.buildSnapshot(studentId);

    const agent = AIOrchestrator.getAgent('mock_interview');
    if (!agent) {
      throw new NotFoundError('Mock Interview Agent not configured');
    }

    // Execute agent in question generation mode
    const output = await agent.execute(snapshot, {
      mode: 'question',
      type: session.type,
      history: session.turns.map(t => ({ question: t.question, answer: t.answer })),
    });

    const questionText = output.question || 'Describe your technical background and experience with project development.';

    // Append to turns
    session.turns.push({
      question: questionText,
      agentVersion: agent.metadata.version,
      modelUsed: env.AI_MODEL || 'gemini-1.5-flash',
      timestamp: new Date(),
    });

    await session.save();

    res.status(200).json({
      success: true,
      data: {
        question: questionText,
        session,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const evaluateAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer || typeof answer !== 'string') {
      throw new BadRequestError('Answer body is required');
    }

    const session = await MockInterviewSession.findById(id);
    if (!session) {
      throw new NotFoundError('Mock interview session not found');
    }

    if (session.student.toString() !== studentId) {
      throw new ForbiddenError('Unauthorized to access this interview session');
    }

    if (session.status === 'COMPLETED') {
      throw new BadRequestError('Interview session is already completed');
    }

    if (session.turns.length === 0) {
      throw new BadRequestError('No question generated yet');
    }

    const lastTurn = session.turns[session.turns.length - 1];
    if (lastTurn.answer) {
      throw new BadRequestError('Last question has already been answered');
    }

    // Sanitize answer
    const sanitizedAnswer = sanitizeAnswer(answer);

    const snapshot = await AIContextBuilder.buildSnapshot(studentId);
    const agent = AIOrchestrator.getAgent('mock_interview');
    if (!agent) {
      throw new NotFoundError('Mock Interview Agent not configured');
    }

    // Evaluate answer
    const output = await agent.execute(snapshot, {
      mode: 'evaluation',
      question: lastTurn.question,
      answer: sanitizedAnswer,
    });

    // Save metrics
    lastTurn.answer = sanitizedAnswer;
    lastTurn.evaluation = {
      correctness: output.correctness || 'Average response coverage',
      relevance: output.relevance || 'Relevant to tech topic',
      completeness: output.completeness || 'Briefly covers core requirements',
      communicationQuality: output.communicationQuality || 'Clear presentation language',
      structure: output.structure || 'Satisfies basic interview structure',
      technicalDepth: output.technicalDepth || 'Exhibits intermediate depth concepts',
      score: output.score !== undefined ? Number(output.score) : 75,
      feedback: output.feedback || 'Consider explaining complexity optimizations next time.',
    };

    await session.save();

    res.status(200).json({
      success: true,
      data: {
        evaluation: lastTurn.evaluation,
        session,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const finishSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { id } = req.params;

    const session = await MockInterviewSession.findById(id);
    if (!session) {
      throw new NotFoundError('Mock interview session not found');
    }

    if (session.student.toString() !== studentId) {
      throw new ForbiddenError('Unauthorized to access this interview session');
    }

    if (session.status === 'COMPLETED') {
      throw new BadRequestError('Interview session is already completed');
    }

    const snapshot = await AIContextBuilder.buildSnapshot(studentId);
    const agent = AIOrchestrator.getAgent('mock_interview');
    if (!agent) {
      throw new NotFoundError('Mock Interview Agent not configured');
    }

    // Run agent to generate final feedback
    const output = await agent.execute(snapshot, {
      mode: 'feedback',
      history: session.turns.map(t => ({
        question: t.question,
        answer: t.answer,
        score: t.evaluation?.score,
      })),
    });

    session.overallScore = output.overallScore !== undefined ? Number(output.overallScore) : 80;
    session.overallFeedback = output.overallFeedback || 'Completed mock practice. Strong coding layout and formatting syntax.';
    session.status = 'COMPLETED';

    await session.save();

    // 1. Integration: Update placement readiness score on Student Profile
    const profile = await StudentProfile.findOne({ user: studentId });
    if (profile) {
      profile.placementReadinessScore = Math.round(
        (profile.placementReadinessScore + session.overallScore) / 2
      );
      await profile.save();
    }

    // 2. Integration: Invalidate existing learning paths and skill gaps
    await AIInsight.updateMany(
      { user: new mongoose.Types.ObjectId(studentId), agent: 'learning_path' },
      { status: 'STALE' }
    );
    await AIInsight.updateMany(
      { user: new mongoose.Types.ObjectId(studentId), agent: 'skill_gap' },
      { status: 'STALE' }
    );

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};
