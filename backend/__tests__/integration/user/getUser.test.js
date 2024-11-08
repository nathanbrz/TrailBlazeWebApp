/**
 * Retrieve User Test
 * This file contains integration tests for user data retrieval, including:
 * TC-001-BE: Verify retrieval of user from database 
 */

const request = require('supertest');
const app = require('../../../server');
const User = require('../../../dbmodels/user');


// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
    req.user = { uid: "mockFirebaseUserID", email: "test@example.com" }; // Mock a Firebase UID
    next();
  });

describe("GET /api/users - getUser (Integration Test: userController, Database, and Mocked Authentication)", () => {
    // Clean up the database before each test 
    beforeEach(async () => {
        await User.deleteMany({});
    });

    // Test case for getting a user by firebaseUID
    it("should return the user if found", async() => {
        // Create a user directly in the database
        await User.create({
            firebaseUID: "mockFirebaseUserID",
            email: "test@example.com",
            first_name: "Existing",
            last_name: "User"
        });
    
        // Send a GET request to /api/users endpoint to retrieve the user
        const res = await request(app).get("/api/users/mockFirebaseUserID");
    
        // Verify response status and user data
        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe("test@example.com");
        expect(res.body.user.first_name).toBe("Existing");
        expect(res.body.user.last_name).toBe("User");
    });

    // Test case for when the user is not found
    it("should return 404 if the user is not found", async() => {
        const res = await request(app).get("/api/users/nonExistentUserID");
        
        // Verify response status and message
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("User not found");

    });

    // Test case to handle database error
    it("should handle database error and return error code 500", async () => {
        jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error("Database error"));
        
        const res = await request(app).get("/api/users/mockFirebaseUserID");
        
        // Verify response status and message
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Error getting user");
      });
});