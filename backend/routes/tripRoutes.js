const express = require('express');
const { createTrip, getAllTrips, requestItinerary } = require('../controllers/tripController');
const { generateItinerary } = require('../services/openaiService');

const router = express.Router();

// Route to create a trip
router.post('/trips', createTrip);

// Route to get all trips
router.get('/trips', getAllTrips);

// Route to generate itinerary
router.post('/request-itinerary', requestItinerary);

module.exports = router;