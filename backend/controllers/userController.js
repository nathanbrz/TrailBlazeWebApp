const User = require('../models/user');

// POST: Create a new user
const createUser = async (req, res) => {
    const { firebaseUID, email, first_name, last_name } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ firebaseUID });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({ firebaseUID, email, first_name, last_name });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// GET: Get user by firebaseUID
const getUser = async (req, res) => {
    const { firebaseUID } = req.params;

    try {
        const user = await User.findOne({ firebaseUID });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting user', error });
    }
};

module.exports = { createUser, getUser };