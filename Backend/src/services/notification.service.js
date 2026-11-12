const Notification = require('../models/notification.model');

const notificationService = {
  listNotifications: () => Notification.find().sort({ createdAt: -1 }),
  getNotificationById: (id) => Notification.findById(id),
  createNotification: (payload) => Notification.create(payload),
  updateNotification: (id, payload) => Notification.findByIdAndUpdate(id, payload, { new: true }),
  deleteNotification: (id) => Notification.findByIdAndDelete(id),
  getPublishedNotifications: () => Notification.find({ status: 'published' }).sort({ createdAt: -1 }),
};

module.exports = notificationService;
