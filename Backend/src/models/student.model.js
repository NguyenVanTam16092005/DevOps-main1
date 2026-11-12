const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    studentClass: {
      type: String,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: false, // Make optional just in case, but we will collect it in form
    },
    gpa: {
      type: Number,
      default: 8.5,
    },
    attendanceRate: {
      type: Number,
      default: 95,
    },
    midtermScore: {
      type: Number,
      default: 8.5,
    },
    finalScore: {
      type: Number,
      default: 8.5,
    },
    attendanceScore: {
      type: Number,
      default: 9.5,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;