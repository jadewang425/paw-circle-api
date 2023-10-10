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
			default: 'Dog',
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
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	}
)

petSchema.virtual('age').get(function() {
	let age = Date.now() - this.birthday.getTime()
	age = new Date(age)
	if (age.getUTCFullYear() > 1970) {
		age = `${Math.abs(age.getUTCFullYear() - 1970)} years old`
	} else if (age.getMonth() > 0) {
		age = `${age.getMonth()} months old`
	} else if (age.getDate() > 7) {
		const weeks = Math.floor(age.getDate() / 7)
		age = `${weeks} weeks old`
	} else {
		age = `${age.getDate()} days old`
	}
	return age
})

module.exports = mongoose.model('Pet', petSchema)
