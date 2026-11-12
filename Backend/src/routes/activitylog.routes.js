const router = require('express').Router();
const activityLogController = require('../controllers/activitylog.controller');

router.route('/').get(activityLogController.list);
router.route('/recent').get(activityLogController.getRecent);
router.route('/module/:module').get(activityLogController.getByModule);
router.route('/:id').get(activityLogController.getById);

module.exports = router;
