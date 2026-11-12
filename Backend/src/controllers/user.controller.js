const userService = require('../services/user.service');

const userController = {
  list: async (req, res) => {
    try {
      const users = await userService.listUsers();
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  create: async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  update: async (req, res) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ message: 'User deleted.' });
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
};

module.exports = userController;
