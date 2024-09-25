const Prompt = require('../dbmodels/prompt')
const mongoose = require('mongoose')

const savePrompt = async (req, res) => {
	try {
		const {start_location, end_location, duration, interest} = req.body
		const promptID = new mongoose.Types.ObjectId()
		const newPrompt = new Prompt({
			promptID,
			start_location, 
			end_location, 
			duration, 
			interest 
		})
		await newPrompt.save();
        res.status(201).json(newPrompt);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

const getPrompt = async (req, res) => {
	try {
		const {ID} = req.body
		const prompt = await Prompt.find({promptID: ID})
		res.status(200).json(prompt);
    } catch (error) {
        res.status(500).json({ error: error.message });
	}
}

module.exports = {
	savePrompt,
	getPrompt
}