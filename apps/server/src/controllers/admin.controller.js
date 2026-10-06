import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { AuditLog } from '../models/AuditLog.js';
import { Job } from '../models/Job.js';
import { JobApplication } from '../models/JobApplication.js';
import { AgentRegistry } from '../ai/agents/index.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export const getSystemHealth = async (req, res, next) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    };

    const uptimeSeconds = Math.floor(process.uptime());
    const memoryUsage = process.memoryUsage();

    const [totalUsers, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      JobApplication.countDocuments(),
    ]);

    const activeAgentCount = AgentRegistry.getAllAgents ? AgentRegistry.getAllAgents().length : 21;

    res.status(200).json({
      success: true,
      data: {
        status: dbState === 1 ? 'HEALTHY' : 'DEGRADED',
        database: {
          status: dbStatusMap[dbState] || 'Unknown',
          name: mongoose.connection.name || 'campusgent',
        },
        uptime: uptimeSeconds,
        memoryUsage: {
          rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
          heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        },
        metrics: {
          totalUsers,
          totalJobs,
          totalApplications,
          activeAgents: activeAgentCount,
        },
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search || '';
    const role = req.query.role || '';

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['STUDENT', 'FACULTY', 'PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'];
    if (!validRoles.includes(role)) {
      throw new BadRequestError(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Audit log
    await AuditLog.create({
      user: req.user.id,
      action: 'USER_ROLE_UPDATE',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: {
        targetUserId: userId,
        targetUserEmail: user.email,
        oldRole,
        newRole: role,
      },
    });

    res.status(200).json({
      success: true,
      message: `User role updated from ${oldRole} to ${role}`,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AuditLog.find()
        .populate('user', 'firstName lastName email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 }).lean();
    res.status(200).json({
      success: true,
      data: { departments },
    });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description } = req.body;
    if (!name || !code) {
      throw new BadRequestError('Department name and code are required');
    }

    const existing = await Department.findOne({ code: code.toUpperCase() });
    if (existing) {
      throw new BadRequestError(`Department code "${code}" already exists`);
    }

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: { department },
    });
  } catch (error) {
    next(error);
  }
};
