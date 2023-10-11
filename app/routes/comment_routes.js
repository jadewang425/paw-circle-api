const express = require('express')
const passport = require('passport')

const Meetup = require('../models/meetup')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE
// POST comment
router.post('/meetups/:meetupId', requireToken, (req, res, next) => {
	req.body.comment.owner = req.user._id
    Meetup.findById(req.params.meetupId)
        .then(handle404)
        .then(meetup => {
            meetup.comments.push(req.body.comment)
            return meetup.save()
        })
		.then((meetup) => {
			res.status(201).json({ meetup: meetup.toObject() })
		})
		.catch(next)
})

// UPDATE
// PATCH /meetups/:meetupId/:commentId
router.patch('/meetups/:meetupId/:commentId', requireToken, (req, res, next) => {
	delete req.body.comment.owner
    const mId = req.params.meetupId
    const cId = req.params.commentId
	Meetup.findById(mId)
		.then(handle404)
		.then(meetup => {
            const theComment = meetup.comments.id(cId)
			requireOwnership(req, theComment)
			theComment.set(req.body.comment)
			return meetup.save()
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		.catch(next)
})

// // DELETE /meetups/:meetupId/:commentId
router.delete('/meetups/:meetupId/:commentId', requireToken, (req, res, next) => {
    const mId = req.params.meetupId
    const cId = req.params.commentId
	Meetup.findById(mId)
		.then(handle404)
		.then(meetup => {
            const theComment = meetup.comments.id(cId)
// 			// throw an error if current user doesn't own `meetup`
			requireOwnership(req, theComment)
// 			// delete the meetup ONLY IF the above didn't throw
			theComment.deleteOne()
            return meetup.save()
		})
// 		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
// 		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router