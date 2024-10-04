const express = require('express');
const { savePrompt, getPrompt} = require('../controllers/promptController');

const router = express.Router();

// Route to save a prompt
router.post('/save', savePrompt);

// Route to retrieve a prompt
router.get('/get', getPrompt)

module.exports = router;