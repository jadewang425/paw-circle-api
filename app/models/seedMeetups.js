const mongoose = require('mongoose')
const Meetup = require('./meetup')
const db = require('../../config/db')

const startMeetups = [
    { title: 'Corgie Party', date: '11/11/2023', type: 'Dog', description: 'Corgie social!', location: 'NYC'},
    { title: 'Cat Social', date: '11/20/2023', type: 'Cat', description: 'For non-introvert cats to meet other cats!', location: 'Chicago'}
]

mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        Meetup.deleteMany({ owner: null })
            .then(deleteMeetups => {
                console.log('the deleted meetups: \n', deleteMeetups)

                Meetup.create(startMeetups)
                    .then(newMeetups => {
                        console.log('new meetups added \n', newMeetups)
                        mongoose.connection.close()
                    })
                    .catch(err => {
                        console.log('an error occured: \n', err)
                        mongoose.connection.close()
                    })
            })
            .catch(err => {
                console.log('an error occured: \n', err)
                mongoose.connection.close()
            })
    })
    .catch(err => {
        console.log('an error occured: \n', err)
        mongoose.connection.close()
    })