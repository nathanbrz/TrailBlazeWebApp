const express = require('express');
const router = express.Router();
const { createTrip, getAllTrips } = require('../controllers/tripController');

// Route to create a trip
router.post('/trips', createTrip);

router.get('/trips', getAllTrips);

module.exports = router;