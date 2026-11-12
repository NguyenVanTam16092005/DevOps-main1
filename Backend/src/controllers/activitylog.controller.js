const activityLogService = require('../services/activitylog.service');

const activityLogController = {
  list: async (req, res) => {
    try {
      const logs = await activityLogService.listActivityLogs();
      res.json(logs);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  getRecent: async (req, res) => {
    try {
      const limit = req.query.limit || 20;
      const logs = await activityLogService.getRecentActivityLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  getByModule: async (req, res) => {
    try {
      const logs = await activityLogService.getActivityLogsByModule(req.params.module);
      res.json(logs);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const log = await activityLogService.getActivityLogById(req.params.id);
      res.json(log);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
};

module.exports = activityLogController;
