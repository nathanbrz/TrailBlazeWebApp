const Trip = require("../dbmodels/trip");
const Stop = require("../dbmodels/stop");
const { generateItinerary } = require("../services/openaiService");

// POST: Create a new trip
const createTrip = async (req, res) => {
  try {
    const { name, start_location, end_location, total_duration, trip_interest } =
      req.body;

    // Use the userID from the Firebase token
    const userID = req.user.uid;

    // Generate itinerary using OpenAI API based on trip details
    const generatedItinerary = await generateItinerary(
      start_location,
      end_location,
      total_duration,
      trip_interest
    );

    // Map the generated itinerary data into Stop model instances
    const stops = generatedItinerary.itinerary.map((item) => {
      return new Stop({
        day: parseInt(item.day), // Convert 'day' to number
        location: item.location,
        stay: parseInt(item.stay), // Convert 'stay' to number
        hotel: item.hotel,
        activities: item.activities.map((activity) => ({
          name: activity.name,
          description: activity.description,
        })),
        travel_time: parseFloat(item.travel_time), // Convert 'travel_time' to number
        notes: item.notes,
      });
    });

    // Create a new Trip instance with the parsed itinerary stops
    const newTrip = new Trip({
      userID,
      name,
      start_location,
      end_location,
      total_duration,
      trip_interest,
      itinerary: stops,
    });

    // Save the new trip document to the database
    await newTrip.save();

    res.status(201).json(newTrip);
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(400).json({ error: error.message });
  }
};

// GET: Retrieve all trips for the authenticated user
const getAllTrips = async (req, res) => {
  try {
    const userID = req.user.uid;

    // Fetch all trips for the user
    const trips = await Trip.find({ userID: userID });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTripName = async (req, res) => {
  try {
    const tripID = req.params.id
    const new_name = req.body.name

    await Trip.findByIdAndUpdate(tripID, {
      $set: {
        name: new_name
      }
    })

  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: error.message });
  }
}

// DELETE: Delete a specific trip by ID
const deleteTrip = async (req, res) => {
  try {
    const userID = req.user.uid;
    const tripID = req.params.id; // Trip ID from route parameters

    // Find the trip for the user by trip ID and if it exists, delete it
    const trip = await Trip.findOne({ _id: tripID, userID: userID });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Delete the trip by ID
    await Trip.deleteOne({ _id: tripID });
    res.status(200).json({ message: "Trip deleted" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  deleteTrip,
  updateTripName
};
