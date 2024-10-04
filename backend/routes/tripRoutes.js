const express = require('express');
const { createTrip, getAllTrips, requestItinerary } = require('../controllers/tripController');
const { savePrompt, getPrompt} = require('../controllers/promptController');

const router = express.Router();

// Route to create a trip
router.post('/', createTrip);

// Route to get all trips (for testing)
router.get('/', getAllTrips);

// Route to generate itinerary
router.post('/request-itinerary', requestItinerary);

// Not sure if these should go in a separate file

	// Route to save a prompt
	router.post('/save-prompt', savePrompt);

	// Route to retrieve a prompt
	router.get('/get-prompt', getPrompt)

	module.exports = router;