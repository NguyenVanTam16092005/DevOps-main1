const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
	{
		teacherId: {
			type: String,
			required: true,
			unique: true,
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
		department: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		specialization: {
			type: String,
		},
		assignedClass: {
			type: String,
			default: '',
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
	},
	{ timestamps: true },
);

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
