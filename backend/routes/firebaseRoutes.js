const express = require("express");
const authMiddleware = require("../middleware/firebaseMiddleware");
let router = express.Router();

// POST request to '/session' with authMiddleware to verify token
router.post("/session", authMiddleware, (req, res) => {
  // The token has been verified by authMiddleware, and user info is available in req.user
  const uid = req.user.uid; // Get the uid from the decoded token

  console.log("User ID:", uid);

  // Successfully verified Token
  res.status(200).json({
    success: true,
    message: "Verified Token and session established",
    uid: uid,
  });
});

module.exports = router;
