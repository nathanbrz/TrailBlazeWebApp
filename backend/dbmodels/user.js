const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	userID: {
		type: mongoose.ObjectId,
		required: true
	},

	username: {
		type: String,
		required: true
	},

	email: String

})

const User = mongoose.model('user', userSchema)
module.exports = User