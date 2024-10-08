const express = require('express');
const router = express.Router();
const { createUser, getUser } = require('../controllers/userController');

// Middleware that authenticates Firebase token
const authenticateUser = require("../middleware/firebaseMiddleware");

console.log('createUser:', createUser);
console.log('getUser:', getUser);
console.log('authenticateUser:', authenticateUser);

// Create user
router.post('/', authenticateUser, createUser);

// Get user by firebaseUID
router.get('/:firebaseUID', authenticateUser, getUser);

module.exports = router;