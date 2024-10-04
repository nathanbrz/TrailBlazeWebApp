// Manages the user token authentication
import { initializeApp } from 'firebase-admin/app';


/*
Initializing Firebase Admin
Use your Environment Variables 
*/
const config = {
  credential: admin.credential.cert({
    type: process.env.ADMIN_FIREBASE_TYPE,
    project_id: process.env.ADMIN_FIREBASE_PROJECT_ID,
    private_key_id: process.env.ADMIN_FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.ADMIN_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
    client_id: process.env.ADMIN_FIREBASE_CLIENT_ID,
    auth_uri: process.env.ADMIN_FIREBASE_AUTH_URI,
    token_uri: process.env.ADMIN_FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.ADMIN_FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.ADMIN_FIREBASE_CERT_URL,
    universe_domain: process.env.ADMIN_FIREBASE_UNIVERSE_DOMAIN
  }),
};

// Initialize Firebase Admin if it's not already initialized
const firebaseAdmin = admin.apps.length
  ? admin.app()
  : admin.initializeApp(config);