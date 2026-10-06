import { Notification } from '../models/Notification.js';
import { logger } from '../utils/logger.js';

/**
 * Creates a notification for a specific user.
 * @param {Object} params
 * @param {string} params.recipient - User ObjectId
 * @param {'academic' | 'placement' | 'career' | 'AI' | 'system'} params.type
 * @param {string} params.title
 * @param {string} params.message
 */
export const createNotification = async ({ recipient, type = 'system', title, message }) => {
  try {
    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      read: false,
    });
    return notification;
  } catch (error) {
    logger.error('Failed to create notification', { error: error.message, recipient, title });
    // Non-blocking error so main user operations don't fail if notification fails
    return null;
  }
};

/**
 * Bulk creates notifications for multiple recipients (e.g. all students in a department or drive).
 */
export const bulkCreateNotifications = async (recipients, { type = 'system', title, message }) => {
  try {
    const notifications = recipients.map((recipientId) => ({
      recipient: recipientId,
      type,
      title,
      message,
      read: false,
    }));
    await Notification.insertMany(notifications, { ordered: false });
  } catch (error) {
    logger.error('Failed to bulk create notifications', { error: error.message });
  }
};
