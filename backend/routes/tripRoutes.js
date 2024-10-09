const express = require('express');
const { createTrip, getAllTrips, requestItinerary } = require('../controllers/tripController');

const router = express.Router();

// Middleware that authenticates Firebase token
const authenticateUser = require("../middleware/firebaseMiddleware");

// Route to create a trip
router.post('/', authenticateUser, createTrip);

// Route to get all trips (for testing)
router.get('/', getAllTrips);

// Route to generate itinerary
router.post('/request-itinerary', requestItinerary);

module.exports = router;