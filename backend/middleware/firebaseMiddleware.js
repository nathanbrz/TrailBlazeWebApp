const admin = require('../firebaseAdmin/config');

const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token part

    if (!token) {
        // No token given
        return res.status(401).json({ message: 'Unauthorized access, token required' });
    }
    try {  
        // Token is valid
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; 
        
        // Triggers next route
        next();
    } catch (error) {
        // Token is invalid
        console.error("Authentication error:", error);
        return res.status(401).json({ message: 'Unauthorized access, invalid token' });
    }
};

module.exports = authenticateUser;
