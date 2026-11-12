jest.mock('../../../src/models/notification.model', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Notification = require('../../../src/models/notification.model');
const notificationService = require('../../../src/services/notification.service');

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listNotifications sorts newest first', async () => {
    Notification.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ title: 'N1' }]) });

    await expect(notificationService.listNotifications()).resolves.toEqual([{ title: 'N1' }]);
    expect(Notification.find).toHaveBeenCalled();
  });

  test('create and update notifications delegate to model methods', async () => {
    Notification.create.mockResolvedValue({ title: 'New notice' });
    Notification.findByIdAndUpdate.mockResolvedValue({ title: 'Updated notice' });

    await expect(notificationService.createNotification({ title: 'New notice' })).resolves.toEqual({
      title: 'New notice',
    });
    await expect(notificationService.updateNotification('id-1', { title: 'Updated notice' })).resolves.toEqual({
      title: 'Updated notice',
    });
  });

  test('getPublishedNotifications filters by status', async () => {
    Notification.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ status: 'published' }]) });

    await expect(notificationService.getPublishedNotifications()).resolves.toEqual([
      { status: 'published' },
    ]);

    expect(Notification.find).toHaveBeenCalledWith({ status: 'published' });
  });
});