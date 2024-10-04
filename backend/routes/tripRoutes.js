const express = require('express');
const { createTrip, getAllTrips, requestItinerary } = require('../controllers/tripController');

const router = express.Router();

// Route to create a trip
router.post('/', createTrip);

// Route to get all trips (for testing)
router.get('/', getAllTrips);

// Route to generate itinerary
router.post('/request-itinerary', requestItinerary);

module.exports = router;