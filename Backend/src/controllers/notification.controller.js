const notificationService = require('../services/notification.service');
const activityLogService = require('../services/activitylog.service');

const notificationController = {
  list: async (req, res) => {
    try {
      const notifications = await notificationService.listNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  getPublished: async (req, res) => {
    try {
      const notifications = await notificationService.getPublishedNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  create: async (req, res) => {
    try {
      const notification = await notificationService.createNotification({
        ...req.body,
        createdBy: req.user?._id,
      });
      await activityLogService.createActivityLog({
        action: 'CREATE',
        module: 'notification',
        description: `Created notification: ${notification.title}`,
        userId: req.user?._id,
        targetId: notification._id,
      });
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  update: async (req, res) => {
    try {
      const notification = await notificationService.updateNotification(req.params.id, req.body);
      await activityLogService.createActivityLog({
        action: 'UPDATE',
        module: 'notification',
        description: `Updated notification: ${notification.title}`,
        userId: req.user?._id,
        targetId: notification._id,
      });
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  remove: async (req, res) => {
    try {
      const notification = await notificationService.getNotificationById(req.params.id);
      await notificationService.deleteNotification(req.params.id);
      await activityLogService.createActivityLog({
        action: 'DELETE',
        module: 'notification',
        description: `Deleted notification: ${notification?.title}`,
        userId: req.user?._id,
        targetId: req.params.id,
      });
      res.json({ message: 'Notification deleted.' });
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const notification = await notificationService.getNotificationById(req.params.id);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
};

module.exports = notificationController;
