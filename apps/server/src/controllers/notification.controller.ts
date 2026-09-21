import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { unreadOnly } = req.query;

    const query: any = { recipient: userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.recipient.toString() !== userId) {
      throw new ForbiddenError('You are not authorized to update this notification');
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      data: { message: 'All notifications marked as read' },
    });
  } catch (error) {
    next(error);
  }
};
