const router = require('express').Router();
const studentController = require('../controllers/student.controller');

router.route('/').get(studentController.list).post(studentController.create);
router.route('/:id').get(studentController.getById).put(studentController.update).delete(studentController.remove);

module.exports = router;