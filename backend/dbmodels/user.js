const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	
	// The unique Firebase User ID, used to link Firebase authentication with this user
	firebaseUID: {
		type: String,
		required: true,
		unique: true
	},

	email: {
		type: String,
		required: true,
		unique: true
	},

	first_name: {
		type: String,
		required: true
	},

	last_name: {
		type: String,
		required: true
	},
})

const User = mongoose.model('user', userSchema)
module.exports = User