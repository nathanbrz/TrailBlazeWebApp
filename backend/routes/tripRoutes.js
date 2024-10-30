const express = require('express');
const { createTrip, getAllTrips, deleteTrip } = require('../controllers/tripController');

const router = express.Router();

// Middleware that authenticates Firebase token
const authenticateUser = require("../middleware/firebaseMiddleware");

// Route to create a trip
router.post('/', authenticateUser, createTrip);

// Route to get all trips
router.get('/', authenticateUser, getAllTrips);

// Route to delete a trip
router.delete('/:id', authenticateUser, deleteTrip);

module.exports = router;