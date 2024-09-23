const Trip = require('../dbmodels/trip')

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

module.exports = {
    createTrip,
    getAllTrips,
};