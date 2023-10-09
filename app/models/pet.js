const mongoose = require('mongoose')

const petSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ['Dog', 'Cat', 'Other'],
			required: true,
		},
		birthday: {
			type: Date,
			required: true,
		},
		picture: {
			type: String,
		},
		aboutme: {
			type: String,
		},
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

module.exports = mongoose.model('Pet', petSchema)
