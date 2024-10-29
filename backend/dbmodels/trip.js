const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Stop = require('./stop')

const tripSchema = new Schema({
	userID: {
        type: String,  // Store the Firebase UID as a string
        required: true
	},
	total_duration: Number,
	start_location: String,
	end_location: String,
	trip_interest: String,
	itinerary: [Stop.schema]
}, { timestamps: true })

const Trip = mongoose.model('trip', tripSchema)
module.exports = Trip