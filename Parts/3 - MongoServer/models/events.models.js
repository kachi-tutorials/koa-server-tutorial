const mongoose = require('.');
const Schema = mongoose.Schema;

const eventsSchema = new Schema({
    attendees: Number,
    name: String,
    adultsOnly: Boolean,
    description: String,
    organizers: String
});

const Events = mongoose.model('events', eventsSchema);

module.exports = Events;