const { initializeApp } = require('firebase-admin/app');
const admin = require('firebase-admin');
const credentials = require('./firebaseCredentials.json')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


// Initalizing Web App Instance
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

module.exports = admin;