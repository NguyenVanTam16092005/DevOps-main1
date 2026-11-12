const userService = require('../services/user.service');

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      const user = await userService.authenticateUser(username, password);
      res.json({ user });
    } catch (error) {
      const statusCode = error.code === 'ACCOUNT_LOCKED' ? 423 : error.code === 'ACCOUNT_NOT_FOUND' || error.code === 'INVALID_PASSWORD' ? 401 : 400;
      res.status(statusCode).json({ message: 'Error: ' + error.message, code: error.code });
    }
  },
};

module.exports = authController;
