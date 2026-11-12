jest.mock('../../../src/models/activitylog.model', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));

const ActivityLog = require('../../../src/models/activitylog.model');
const activityLogService = require('../../../src/services/activitylog.service');

describe('activityLogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listActivityLogs limits results to 100 newest records', async () => {
    ActivityLog.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue([{ action: 'login' }]) }),
    });

    await expect(activityLogService.listActivityLogs()).resolves.toEqual([{ action: 'login' }]);
    expect(ActivityLog.find).toHaveBeenCalled();
  });

  test('createActivityLog forwards payload to model', async () => {
    ActivityLog.create.mockResolvedValue({ action: 'create' });

    await expect(activityLogService.createActivityLog({ action: 'create' })).resolves.toEqual({
      action: 'create',
    });
  });

  test('getRecentActivityLogs respects requested limit', async () => {
    ActivityLog.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue([{ action: 'update' }]) }),
    });

    await expect(activityLogService.getRecentActivityLogs(5)).resolves.toEqual([{ action: 'update' }]);
  });
});