import { Request, Response, NextFunction } from 'express';
import { UserRoleType, UserRole } from '@campusgent/shared';
import { ForbiddenError } from '../utils/errors';

// Roles-to-Permissions Registry
const RolePermissions: Record<UserRoleType, string[]> = {
  [UserRole.STUDENT]: [
    'profile:read',
    'profile:write',
    'academics:read',
    'jobs:read',
    'applications:read',
    'applications:create',
    'ai:career',
    'ai:resume',
    'ai:interview',
  ],
  [UserRole.FACULTY]: [
    'profile:read',
    'academics:read',
    'academics:write',
    'jobs:read',
    'applications:read',
  ],
  [UserRole.PLACEMENT_OFFICER]: [
    'profile:read',
    'academics:read',
    'jobs:read',
    'jobs:write',
    'applications:read',
    'applications:write',
  ],
  [UserRole.ADMIN]: ['*'], // Wildcard permission matching everything
  [UserRole.SUPER_ADMIN]: ['*'],
};

export const requireRole = (allowedRoles: UserRoleType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Authentication context missing'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError(`Access Denied: Requires one of [${allowedRoles.join(', ')}] roles`));
      return;
    }

    next();
  };
};

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Authentication context missing'));
      return;
    }

    const userPermissions = RolePermissions[req.user.role] || [];

    // Admin wildcard or exact match
    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      next();
      return;
    }

    next(new ForbiddenError(`Access Denied: Missing permission "${permission}"`));
  };
};
