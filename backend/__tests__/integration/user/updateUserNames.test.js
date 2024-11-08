/**
 * Update User Names Test
 * This file contains integration tests for user names updating, including:
 * TC-018: Ensure user name can be updated in database
 */

const request = require('supertest');
const app = require('../../../server');
const User = require('../../../dbmodels/user');

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
    req.user = { uid: "mockFirebaseUserID", email: "test@example.com" }; // Mock a Firebase UID
    next();
  });

describe("PUT /api/users/names - updateUserNames (Integration Test: userController, Database, and Mocked Authentication)", () => {
    // Clean up the database before each test 
    beforeEach(async () => {
        await User.deleteMany({});
    });

    // Test case for updating user names
    it("should update the user's names", async () => {
        // Create a user directly in the database
        await User.create({
            firebaseUID: "mockFirebaseUserID",
            email: "test@example.com",
            first_name: "John",
            last_name: "Doe"
        });

        const res = await request(app)
            .put("/api/users/names")
            .send({first_name: "Jane", last_name: "Smith"});
        
        // Verify response status and message
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User names updated successfully");

        // Check that the user's names were udpated in the database
        const user = await User.findOne({firebaseUID: "mockFirebaseUserID"});
        expect(user.first_name).toBe("Jane");
        expect(user.last_name).toBe("Smith"); 
    });

    // Test case to handle database error
    it("should handle database error and return error code 500", async () => {
        jest.spyOn(User, "findOneAndUpdate").mockRejectedValueOnce(new Error("Database error"));
      
        const res = await request(app).put("/api/users/names").send({
          first_name: "Jane",
          last_name: "Smith",
        });
      
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Error updating user");
      });
});