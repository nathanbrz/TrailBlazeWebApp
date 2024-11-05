const express = require("express");
const router = express.Router();

// Import controller functions for user actions
const {
  totalTripsCreated,
  averageTripLength,
  mostPopularTripStyle,
  totalUsers,
} = require("../controllers/overviewController");

// GET request to '/totalTripsCreated'
router.get("/totalTripsCreated", totalTripsCreated);

// GET request to '/averageTripLength'
router.get("/averageTripLength", averageTripLength);

// GET request to '/mostPopularTripStyle'
router.get("/mostPopularTripStyle", mostPopularTripStyle);

// GET request to '/totalUsers'
router.get("/totalUsers", totalUsers);

module.exports = router;