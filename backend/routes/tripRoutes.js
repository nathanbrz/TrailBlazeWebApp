const express = require("express");
const {
  createTrip,
  getAllTrips,
  deleteTrip,
  updateTripName
} = require("../controllers/tripController");

const router = express.Router();

// Middleware that authenticates Firebase token
const authenticateUser = require("../middleware/firebaseMiddleware");

// POST request to '/' with authentication middleware
router.post("/", authenticateUser, createTrip);

// GET request to '/' with authentication middleware
router.get("/", authenticateUser, getAllTrips);

// PUT request to '/' with authentication middleware
router.put("/", updateTripName)

// DELETE request to '/:id' with authentication middleware
router.delete("/:id", authenticateUser, deleteTrip);

module.exports = router;
