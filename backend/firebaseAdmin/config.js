const { initializeApp } = require('firebase-admin/app');
const admin = require('firebase-admin');

let credentials;
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  credentials = require('./firebaseCredentials.json');
} else {
  credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
}


// Initalizing Web App Instance
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

module.exports = admin;