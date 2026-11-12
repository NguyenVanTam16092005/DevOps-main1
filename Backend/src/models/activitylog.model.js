const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activityLogSchema = new Schema(
	{
		action: {
			type: String,
			required: true,
		},
		module: {
			type: String,
			enum: ['student', 'teacher', 'user', 'notification', 'system'],
			required: true,
		},
		description: {
			type: String,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		targetId: {
			type: String,
		},
		status: {
			type: String,
			enum: ['success', 'failed'],
			default: 'success',
		},
	},
	{ timestamps: true },
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
