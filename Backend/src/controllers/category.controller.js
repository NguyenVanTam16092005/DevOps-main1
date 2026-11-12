const Category = require('../models/category.model');

const categoryController = {
  list: async (req, res) => {
    try {
      const categories = await Category.find().sort({ type: 1, name: 1 });
      res.json(categories);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  create: async (req, res) => {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  update: async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  remove: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully.' });
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  seed: async (req, res) => {
    try {
      const count = await Category.countDocuments();
      if (count === 0) {
        const defaults = [
          { name: 'Công nghệ thông tin', type: 'Khoa', description: 'Khoa CNTT', status: 'active' },
          { name: 'Lập trình Web', type: 'Môn học', description: 'Môn học chuyên ngành', status: 'active' },
          { name: 'CNTT-K62', type: 'Lớp học', description: 'Lớp sinh viên khóa 62', status: 'active' },
          { name: 'Kỹ thuật phần mềm', type: 'Ngành học', description: 'Ngành Kỹ thuật phần mềm', status: 'active' },
        ];
        await Category.insertMany(defaults);
        return res.json({ message: 'Seeded default categories.' });
      }
      res.json({ message: 'Categories already exist, no seeding needed.' });
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  }
};

module.exports = categoryController;
