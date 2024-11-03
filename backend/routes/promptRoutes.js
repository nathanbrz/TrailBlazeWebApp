const express = require("express");
const { savePrompt, getPrompt } = require("../controllers/promptController");

const router = express.Router();

// POST request to '/save' calls the savePrompt function
router.post("/save", savePrompt);

// GET request to '/get' calls the getPrompt function
router.get("/get", getPrompt);

module.exports = router;
