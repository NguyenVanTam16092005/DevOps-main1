const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');

router.route('/').get(notificationController.list).post(notificationController.create);
router.route('/published').get(notificationController.getPublished);
router.route('/:id').get(notificationController.getById).put(notificationController.update).delete(notificationController.remove);

module.exports = router;
