const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ['system', 'teacher', 'admin'],
			default: 'system',
		},
		audience: {
			type: String,
			enum: ['all', 'students', 'teachers', 'admin'],
			default: 'all',
		},
		status: {
			type: String,
			enum: ['published', 'draft'],
			default: 'published',
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
