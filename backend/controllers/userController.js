const User = require('../dbmodels/user');

// POST: Create a new user
const createUser = async (req, res) => {
    console.log(req.body)
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const { uid, email } = req.user;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ firebaseUID: uid });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({ firebaseUID: uid, email, first_name, last_name });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// GET: Get user by firebaseUID
const getUser = async (req, res) => {
    const { uid } = req.user;

    try {
        const user = await User.findOne({ firebaseUID: uid });
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