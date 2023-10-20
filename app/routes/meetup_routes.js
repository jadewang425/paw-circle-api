const express = require('express')
const passport = require('passport')

// require models
const Meetup = require('../models/meetup')
const User = require('../models/user')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /meetups
router.get('/meetups', (req, res, next) => {
	Meetup.find()
		.then(meetups => {
			// `meetups` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return meetups.map((meetup) => meetup.toObject())
		})
		// respond with status 200 and JSON of the meetups
		.then((meetups) => res.status(200).json({ meetups: meetups }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /meetups/:id
router.get('/meetups/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Meetup.findById(req.params.id)
		.populate('owner')
		.populate('comments.owner')
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "meetup" JSON
		.then((meetup) => res.status(200).json({ meetup: meetup.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /meetups
router.post('/meetups', requireToken, (req, res, next) => {
	// set owner of new meetup to be current user
	req.body.meetup.owner = req.user.id

	Meetup.create(req.body.meetup)
		// respond to succesful `create` with status 201 and JSON of new "meetup"
		.then((meetup) => {
			res.status(201).json({ meetup: meetup.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /meetups/:id
router.patch('/meetups/:id', requireToken, removeBlanks, (req, res, next) => {
	delete req.body.meetup.owner
	Meetup.findById(req.params.id)
		.then(handle404)
		.then((meetup) => {
			console.log('req.user', req.user)
			requireOwnership(req, meetup)
			return meetup.updateOne(req.body.meetup)
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

// DELETE /meetups/:id
router.delete('/meetups/:id', requireToken, (req, res, next) => {
	Meetup.findById(req.params.id)
		.then(handle404)
		.then((meetup) => {
			// throw an error if current user doesn't own `meetup`
			requireOwnership(req, meetup)
			// delete the meetup ONLY IF the above didn't throw
			meetup.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
