const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.route('/').get(userController.list).post(userController.create);
router.route('/:id').get(userController.getById).put(userController.update).delete(userController.remove);

module.exports = router;
