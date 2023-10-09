const express = require('express')
const passport = require('passport')

const Meetup = require('../models/meetup')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE
// POST comment
router.post('/:meetupId', requireToken, (req, res, next) => {
	// set owner of new pet to be current user
	req.body.author = req.user.id

    Meetup.findById(req.params.meetupId)
        .then(handle404)
        .then(meetup => {
            meetup.comments.push(req.body)
            return meetup.save()
        })
		.then((meetup) => {
			res.status(201).json({ meetup: meetup.toObject() })
		})
		.catch(next)
})

// UPDATE
// PATCH /pets/:id
// router.patch('/pets/:id', requireToken, removeBlanks, (req, res, next) => {
// 	// if the client attempts to change the `owner` property by including a new
// 	// owner, prevent that by deleting that key/value pair
// 	delete req.body.pet.owner

// 	Pet.findById(req.params.id)
// 		.then(handle404)
// 		.then((pet) => {
// 			// pass the `req` object and the Mongoose record to `requireOwnership`
// 			// it will throw an error if the current user isn't the owner
// 			requireOwnership(req, pet)

// 			// pass the result of Mongoose's `.update` to the next `.then`
// 			return pet.updateOne(req.body.pet)
// 		})
// 		// if that succeeded, return 204 and no JSON
// 		.then(() => res.sendStatus(204))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })

// // DESTROY
// // DELETE /pets/:id
// router.delete('/pets/:id', requireToken, (req, res, next) => {
// 	Pet.findById(req.params.id)
// 		.then(handle404)
// 		.then((pet) => {
// 			// throw an error if current user doesn't own `meetup`
// 			requireOwnership(req, pet)
// 			// delete the meetup ONLY IF the above didn't throw
// 			pet.deleteOne()
// 		})
// 		// send back 204 and no content if the deletion succeeded
// 		.then(() => res.sendStatus(204))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })

module.exports = router