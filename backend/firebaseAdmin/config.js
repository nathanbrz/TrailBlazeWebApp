const fs = require("fs");

// Import Firebase Admin SDK functions for app initialization
const { initializeApp } = require("firebase-admin/app");
const admin = require("firebase-admin");

let credentials;

// In non-production (development or testing), load environment variables from a .env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();

  credentials = require("./firebaseCredentials.json");
} else {
  // In production, read Firebase credentials from a secure path
  const jsonDataFromEtc = fs.readFileSync(
    "/etc/secrets/firebaseCredentials.json",
    "utf8"
  );
  credentials = JSON.parse(jsonDataFromEtc);
}

// Initialize Firebase app instance with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

module.exports = admin;
