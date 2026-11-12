const app = require('./src/app');
const connectDb = require('./src/config/db');
const { seedDefaultUsers } = require('./src/services/user.service');
const Category = require('./src/models/category.model');

const PORT = process.env.PORT || 8070;

const bootstrap = async () => {
  await connectDb();

  try {
    await seedDefaultUsers();
    console.log('Default auth users are ready.');
  } catch (error) {
    console.error('Failed to seed default users:', error.message);
  }

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
      console.log('Default categories are ready.');
    }
  } catch (error) {
    console.error('Failed to seed default categories:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is up and running on port : ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('Server bootstrap error:', error.message);
  process.exit(1);
});
