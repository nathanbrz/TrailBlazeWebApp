const mongoose = require('mongoose')
const Schema = mongoose.Schema

const promptSchema = new Schema({
	promptID: {
		type: Schema.Types.ObjectID,
		required: true
	},
	start_location: String,
	end_location: String, 
	duration: Number, 
	interest: String
})

const Prompt = mongoose.model('prompt', promptSchema)
module.exports = Prompt