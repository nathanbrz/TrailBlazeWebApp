// Load environment variables if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 4000; // Default port is 4000 if not specified

// Import route modules
const tripRoutes = require("./routes/tripRoutes");
const userRoutes = require("./routes/userRoutes");
const firebaseRoutes = require("./routes/firebaseRoutes"); // Authentication

// Frontend configuration (production and development)
const FRONTENDURL = process.env.FRONT_END_URL || "http://localhost";
const FRONTENDPORT = process.env.FRONT_END_PORT || "3001";

// Create express app
const app = express();

// List of allowed origins for CORS
const allowedOrigins = [
  "https://trailblazeapp.vercel.app", // Production frontend on Vercel
  `${FRONTENDURL}:${FRONTENDPORT}`, // Local development frontend
];

// CORS Middleware Setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Origin is allowed
      } else {
        callback(new Error("Not allowed by CORS")); // Origin is not allowed
      }
    },
    optionsSuccessStatus: 200, // For legacy browser support
  })
);

// Handle pre-flight requests for CORS
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

// Middleware to parse incoming JSON data
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

// Route definitions with base paths
app.use("/api/trips", tripRoutes); // Routes for trip-related endpoints
app.use("/api/users", userRoutes); // Routes for user-related endpoints
app.use("/api/firebase", firebaseRoutes); // Routes for Firebase authentication-related endpoints

// Function to connect to MongoDB and start the server
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  } finally {
    // Start listening for incoming requests on the specified port
    app.listen(port, () => {
      console.log("Server is listening on port" + port);
    });
  }
}

// Export the app for testing purposes
module.exports = app;

// Call the connect function if not in a test environment
if (process.env.NODE_ENV !== "test") {
  connect();
}