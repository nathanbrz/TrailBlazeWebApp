// Import the Firebase Admin instance configured in firebaseAdmin/config
const admin = require("../firebaseAdmin/config");

// Middleware function to authenticate user using Firebase ID token
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Extract the token from the header, if present (typically "Bearer <token>")
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, send an unauthorized response
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, token required" });
  }
  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach the decoded token (user information) to the request object for use in other route handdlers
    req.user = decodedToken;

    // Triggers next route
    next();
  } catch (error) {
    // Token is invalid
    console.error("Authentication error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized access, invalid token" });
  }
};

module.exports = authenticateUser;
