import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterSchema, LoginSchema, UserRole } from '@campusgent/shared';
import { env } from '../config/env';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import { StudentProfile } from '../models/StudentProfile';
import { FacultyProfile } from '../models/FacultyProfile';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/errors';
import { AuditLog } from '../models/AuditLog';

import mongoose from 'mongoose';

// Helper to generate access tokens
const generateAccessToken = (user: { id: string; email: string; role: string }): string => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

// Helper to generate and store refresh tokens
const generateRefreshToken = async (userId: string): Promise<string> => {
  const token = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
  });

  return token;
};

// Set cookie options
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = RegisterSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      throw new ConflictError('Email address already registered', 'EMAIL_ALREADY_EXISTS');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      role: validatedData.role,
      department: validatedData.department ? new mongoose.Types.ObjectId(validatedData.department) : undefined,
    });

    // Profile instantiation based on role
    if (validatedData.role === UserRole.STUDENT) {
      await StudentProfile.create({
        user: user._id,
        rollNumber: `STU-${Date.now().toString().slice(-6)}`,
        department: validatedData.department ? new mongoose.Types.ObjectId(validatedData.department) : new mongoose.Types.ObjectId(),
        semester: 1,
        cgpa: 0.0,
      });
    } else if (validatedData.role === UserRole.FACULTY) {
      await FacultyProfile.create({
        user: user._id,
        employeeId: `FAC-${Date.now().toString().slice(-6)}`,
        department: validatedData.department ? new mongoose.Types.ObjectId(validatedData.department) : new mongoose.Types.ObjectId(),
      });
    }

    // Security Audit Log
    await AuditLog.create({
      user: user._id,
      action: 'REGISTER',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { email: user.email, role: user.role },
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = LoginSchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const accessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken(user._id.toString());

    user.lastLoginAt = new Date();
    await user.save();

    // Security Audit Log
    await AuditLog.create({
      user: user._id,
      action: 'LOGIN',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    if (req.user) {
      await AuditLog.create({
        user: req.user.id,
        action: 'LOGOUT',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is missing', 'REFRESH_TOKEN_MISSING');
    }

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
      // Security warning: possible replay attack. Clear cookie.
      res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
      throw new UnauthorizedError('Invalid refresh token session', 'REFRESH_TOKEN_INVALID');
    }

    // Token rotation
    await RefreshToken.deleteOne({ _id: tokenDoc._id });

    const user = await User.findById(tokenDoc.user);
    if (!user) {
      throw new UnauthorizedError('User session not found', 'USER_NOT_FOUND');
    }

    const newAccessToken = generateAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = await generateRefreshToken(user._id.toString());

    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication context missing');
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
