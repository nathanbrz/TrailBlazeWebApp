const mongoose = require('mongoose')
const Schema = mongoose.Schema

const activitySchema = new Schema({
	
	name: {
		type: String,
		required: true
	},

	description: String
})

const Activity = mongoose.model('activity', activitySchema)
module.exports = Activity