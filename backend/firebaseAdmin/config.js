const { initializeApp } = require('firebase-admin/app');
const admin = require('firebase-admin');


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  const credentials = require('./firebaseCredentials.json')
} else {
  const credentials = require('/etc/secrets/firebaseCredentials.json')
}


// Initalizing Web App Instance
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

module.exports = admin;