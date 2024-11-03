const Prompt = require("../dbmodels/prompt");
const mongoose = require("mongoose");

// POST: Save a new prompt
const savePrompt = async (req, res) => {
  try {
    const { start_location, end_location, duration, interest } = req.body;
    const promptID = new mongoose.Types.ObjectId(); // Generate a new ObjectId for promptID

    // Create a new Prompt instance with the provided details
    const newPrompt = new Prompt({
      promptID,
      start_location,
      end_location,
      duration,
      interest,
    });
    await newPrompt.save(); // Save the new prompt to the database
    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Retrieve a prompt by promptID
const getPrompt = async (req, res) => {
  try {
    const { ID } = req.body;
    const prompt = await Prompt.find({ promptID: ID }); // Find the prompt by promptID
    res.status(200).json(prompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  savePrompt,
  getPrompt,
};
