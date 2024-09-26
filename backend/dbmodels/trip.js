const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Stop = require('./stop')

const tripSchema = new Schema({
	promptID: {
		type: mongoose.ObjectId,
		ref: 'Prompt',
		required: true
	},
	userID: {
		type: mongoose.ObjectId,
		ref: 'User',
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