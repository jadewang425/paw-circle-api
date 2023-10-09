const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
	{
		comment: {
			type: String,
			required: true
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	}, {
		timestamps: true
	}
)

module.exports = commentSchema