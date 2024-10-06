const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path as necessary
let router = express.Router();

// Endpoint to verify Firebase token
router.post('/session', authMiddleware, (req, res) => {
    // The token is already verified in the middleware, and the user's info is available in req.user
    const uid = req.user.uid; // Get the uid from the decoded token

    console.log("User ID:", uid);

    // Successfully verified Token
    res.status(200).json({
        success: true,
        message: "Verified Token and session established",
        uid: uid
    });
});

// Exporting router
module.exports = router;
