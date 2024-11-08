/**
 * Update User Email Test
 * This file contains integration tests for user email updating, including:
 * TC-020: Ensure user can change their email in firebase and the change reflects in the database
 */

const request = require('supertest');
const app = require('../../../server');
const User = require('../../../dbmodels/user');

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
    req.user = { uid: "mockFirebaseUserID", email: "test@example.com" }; // Mock a Firebase UID
    next();
  });

describe("PUT /api/users/email - updateUserEmail (Integration Test: userController, Database, and Mocked Authentication)", () =>{
    // Clean up the database before each test 
    beforeEach(async () => {
        await User.deleteMany({});
    });

    // Test case for updating user email
    it("should update the user's email", async () => {
        // Create a user directly in the database
        await User.create({
            firebaseUID: "mockFirebaseUserID",
            email: "test@example.com",
            first_name: "John",
            last_name: "Doe"
        });
        
        const res = await request(app)
            .put("/api/users/email")
            .send({email: "newemail@example.com"});
        
        // Verify response status and message
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User email updated successfully");

        // Check that the user's email was udpated in the database
        const user = await User.findOne({firebaseUID: "mockFirebaseUserID"});
        expect(user.email).toBe("newemail@example.com");
    });
});