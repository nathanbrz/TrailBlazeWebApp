const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Import the Stop model, used to define each stop in the trip itinerary
const Stop = require('./stop')

const tripSchema = new Schema({
	
	// The Firebase User ID associated with this trip
	userID: {
        type: String,
        required: true
	},
	total_duration: Number,
	start_location: String,
	end_location: String,
	trip_interest: String,
	itinerary: [Stop.schema] // An array of Stop schema items (sub-document) that represent each stop in the trip
}, { timestamps: true })

const Trip = mongoose.model('trip', tripSchema)
module.exports = Trip