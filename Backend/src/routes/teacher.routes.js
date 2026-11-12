const router = require('express').Router();
const teacherController = require('../controllers/teacher.controller');

router.route('/').get(teacherController.list).post(teacherController.create);
router.route('/:id').get(teacherController.getById).put(teacherController.update).delete(teacherController.remove);

module.exports = router;
