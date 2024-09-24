const Trip = require('../dbmodels/trip')
const { generateItinerary } = require('../services/openaiService');

// Create a new trip
const createTrip = async (req, res) => {
    try {
        const { tripID, userID, created_at, start_location, end_location, total_duration, trip_interest } = req.body;

        const newTrip = new Trip({
            tripID,
            userID,
            created_at,
            start_location,
            end_location,
            total_duration,
            trip_interest,
            itinerary: [] // Initialize with empty itinerary
        });

        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all trips
const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const requestItinerary = async (req, res) => {
    const { start_location, end_location, duration, interest } = req.body;

    if (!start_location || !end_location || !duration || !interest) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Generate itinerary from OpenAI
        const itinerary = await generateItinerary(start_location, end_location, duration, interest);

        res.status(200).json(itinerary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports = {
    createTrip,
    getAllTrips,
    requestItinerary
};