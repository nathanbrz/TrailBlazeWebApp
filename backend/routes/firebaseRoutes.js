const express = require("express")
const firebaseAdmin =  require("./firebaseAdmin/config")
let router = express.Router()

// Endpoint to verify Firebase token
router.post('/session', async (req, res) => {
    const { token } = req.body

    try {
        // Verifying token
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Sucessfully verified Token
        res.status(200).json({
            success: true,
            message: "Verified Token and session established",
            uid: uid
        });
    } catch (error) {
        // Error verifying token
        res.status(401).json({
            success: false,
            message: "Failed to verify token"
        });
    }
});



// Exporting router
module.exports = router