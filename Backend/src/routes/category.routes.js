const router = require('express').Router();
const categoryController = require('../controllers/category.controller');

router.route('/').get(categoryController.list).post(categoryController.create);
router.route('/seed').post(categoryController.seed);
router.route('/:id').get(categoryController.getById).put(categoryController.update).delete(categoryController.remove);

module.exports = router;
