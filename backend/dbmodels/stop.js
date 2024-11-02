const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Activity = require('./activity')

const stopSchema = new Schema({
	day: Number, // The day number for this stop in the itinerary (e.g., Day 1, Day 2)
	location: String,
	stay: Number,
	hotel: String,
	activities: [Activity.schema],
	travel_time: Number,
	notes: String
})

const Stop = mongoose.model('stop', stopSchema)
module.exports = Stop