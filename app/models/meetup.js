const mongoose = require('mongoose')

const commentSchema = require('./comment')

const meetupSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		type: {
			type: String,
			enum: ['Dog', 'Cat', 'Other'],
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		attendees: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pet',
			required: true,
		}],
		comments: [commentSchema],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Meetup', meetupSchema)
