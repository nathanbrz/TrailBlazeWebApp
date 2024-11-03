const express = require("express");
const router = express.Router();

// Import controller functions for user actions
const {
  createUser,
  getUser,
  deleteUser,
} = require("../controllers/userController");

// Import middleware to authenticate Firebase tokens
const authenticateUser = require("../middleware/firebaseMiddleware");

console.log("createUser:", createUser);
console.log("getUser:", getUser);
console.log("authenticateUser:", authenticateUser);

// POST request to '/' with authentication middleware
router.post("/", authenticateUser, createUser);

// GET request to '/:firebaseUID' with authentication middleware
router.get("/:firebaseUID", authenticateUser, getUser);

// DELETE request to '/:firebaseUID' with authentication middleware
router.delete("/:firebaseUID", authenticateUser, deleteUser);

module.exports = router;
