const User = require("../dbmodels/user");
const Trip = require("../dbmodels/trip");
const admin = require("../firebaseAdmin/config");

// POST: Create a new user
const createUser = async (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const { uid, email } = req.user; // Retrieve uid and email from the middleware authenticated user

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ firebaseUID: uid });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // If not, create a new user
    const newUser = new User({
      firebaseUID: uid,
      email,
      first_name,
      last_name,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    console.error("Error in createUser:", error); // Log the error
    res.status(500).json({ message: "Error creating user", error });
  }
};

// GET: Get user by firebaseUID
const getUser = async (req, res) => {
  const { uid } = req.user;

  try {
    // Retrieve user from the database based on firebaseUID
    const user = await User.findOne({ firebaseUID: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting user", error });
  }
};

// UPDATE: Update user names
const updateUserNames = async (req, res) => {
    const { uid } = req.user;
    const new_first_name = req.body.first_name;
    const new_last_name = req.body.last_name;
    try {
       await User.findOneAndUpdate({firebaseUID: uid}, {
        $set: {
            first_name: new_first_name,
            last_name: new_last_name
        }
       })
       res.status(200).json({ message: 'User names updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
}

// UPDATE: Update user email
const updateUserEmail = async (req, res) => {
    const { uid } = req.user;
    const new_email = req.body.email
    try {
        await User.findOneAndUpdate({firebaseUID: uid}, { 
        $set: {
            email: new_email
        }
        })
        res.status(200).json({ message: 'User email updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
}

// DELETE: Delete user by firebaseUID
const deleteUser = async (req, res) => {
  const { uid } = req.user;

  try {
    // Find the user by firebaseUID
    const user = await User.findOne({ firebaseUID: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all trips associated with the user
    await Trip.deleteMany({ userID: uid });

    // Delete the user from Firebase
    await admin.auth().deleteUser(uid);

    // Delete the user from MongoDB
    await User.deleteOne({ firebaseUID: uid });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = { createUser, getUser, deleteUser, updateUserNames, updateUserEmail };
