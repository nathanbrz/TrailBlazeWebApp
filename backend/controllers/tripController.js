const Trip = require('../dbmodels/trip')
const Stop = require('../dbmodels/stop');
const { generateItinerary } = require('../services/openaiService');

// Create trip
const createTrip = async (req, res) => {
    try {
        const { promptID, start_location, end_location, total_duration, trip_interest } = req.body;

        // Use the userID from the Firebase token
        const userID = req.user.uid;

        // Generate the itinerary using the OpenAI API
        const generatedItinerary = await generateItinerary(start_location, end_location, total_duration, trip_interest);

        // Parse the generated itinerary into the Stop schema
        const stops = generatedItinerary.itinerary.map((item) => {
            return new Stop({
                day: parseInt(item.day), // Convert 'day' to number
                location: item.location,
                stay: parseInt(item.stay), // Convert 'stay' to number
                hotel: item.hotel,
                activities: item.activities.map(activity => ({
                    name: activity.name,
                    description: activity.description
                })),
                travel_time: parseFloat(item.travel_time), // Convert 'travel_time' to number
                notes: item.notes
            });
        });

        // Create a new trip and assign the parsed stops to the itinerary
        const newTrip = new Trip({
            promptID,
            userID, 
            start_location,
            end_location,
            total_duration,
            trip_interest,
            itinerary: stops 
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