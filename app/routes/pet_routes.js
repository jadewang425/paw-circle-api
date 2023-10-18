const express = require('express')
const passport = require('passport')

const Pet = require('../models/pet')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /pets
router.get('/pets', (req, res, next) => {
	Pet.find()
		.then((pets) => {
			return pets.map((pet) => pet.toObject())
		})
		// respond with status 200 and JSON of the pets
		.then((pets) => res.status(200).json({ pets: pets }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /pets/:id
router.get('/pets/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Pet.findById(req.params.id)
		.populate('owner')
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "pet" JSON
		.then((pet) => res.status(200).json({ pet: pet.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /pets
router.post('/pets', requireToken, (req, res, next) => {
	// set owner of new pet to be current user
	req.body.pet.owner = req.user.id

	Pet.create(req.body.pet)
		// respond to succesful `create` with status 201 and JSON of new "pet"
		.then((pet) => {
			res.status(201).json({ pet: pet.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /pets/:id
router.patch('/pets/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.pet.owner

	Pet.findById(req.params.id)
		.then(handle404)
		.then((pet) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, pet)

			// pass the result of Mongoose's `.update` to the next `.then`
			return pet.updateOne(req.body.pet)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /pets/:id
router.delete('/pets/:id', requireToken, (req, res, next) => {
	Pet.findById(req.params.id)
		.then(handle404)
		.then((pet) => {
			// throw an error if current user doesn't own `meetup`
			requireOwnership(req, pet)
			// delete the meetup ONLY IF the above didn't throw
			pet.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router

