const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Stop = require('./stop')

const tripSchema = new Schema({
	tripID: {
		type: mongoose.ObjectId,
		required: true
	},
	userID: {
		type: mongoose.ObjectId,
		ref: 'User',
		required: true
	},
	created_at: Number,
	total_duration: Number,
	start_location: String,
	end_location: String,
	trip_interest: String,
	itinerary: [Stop.schema]
})

const Trip = mongoose.model('trip', tripSchema)
module.exports = Trip