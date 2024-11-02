// Load environment variables if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 4000; // Default port is 4000 if not specified

const User = require("./dbmodels/user");
const Trip = require("./dbmodels/trip");

// Import route modules
const tripRoutes = require("./routes/tripRoutes");
const userRoutes = require("./routes/userRoutes");
const promptRoutes = require("./routes/promptRoutes");
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
app.use("/api/prompts", promptRoutes); // Routes for prompt-related endpoints
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
connect(); // Call the connect function to start the server

// Here is some example code showing how to create and query MongoDB models.
// try {
//     // const testuser = new User({
//     //     userID: new mongoose.Types.ObjectId(),
//     //     username: "cole_C",
//     //     email: "fake.email@gmail.com"
//     // })
//     // testuser.save()
// } catch (err) {
//     console.error(err)
// } finally {
//     User.find({username: "cole_C"})
//         .then((res) => {
//             console.log(res)
//         })
// }
