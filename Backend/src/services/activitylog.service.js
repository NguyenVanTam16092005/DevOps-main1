const ActivityLog = require('../models/activitylog.model');

const activityLogService = {
  listActivityLogs: () => ActivityLog.find().sort({ createdAt: -1 }).limit(100),
  getActivityLogById: (id) => ActivityLog.findById(id),
  createActivityLog: (payload) => ActivityLog.create(payload),
  getActivityLogsByModule: (module) => ActivityLog.find({ module }).sort({ createdAt: -1 }).limit(50),
  getRecentActivityLogs: (limit = 20) => ActivityLog.find().sort({ createdAt: -1 }).limit(limit),
};

module.exports = activityLogService;
