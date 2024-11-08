/**
 * Create User Test
 * This file contains integration tests for user creation, including:
 * TC-002-BE: Verify saving new user information into database
 */

const request = require('supertest');
const app = require('../../../server');
const User = require('../../../dbmodels/user');

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
    req.user = { uid: "mockFirebaseUserID", email: "test@example.com" }; // Mock a Firebase UID
    next();
  });

describe("POST /api/users - createUser (Integration Test: userController, Database, and Mocked Authentication)", () => {
    // Clean up the database before each test 
    beforeEach(async () => {
        await User.deleteMany({});
    });

    // Test case for creating a new user
    it("should create a new user, then save the user to the database", async () => {
        const res = await request(app)
            .post("/api/users")
            .send({first_name: "John", last_name: "Doe", email: "test@example.com"});

        // Verify response status and message
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User created successfully");

        // Check that user was saved in the database
        const user = await User.findOne({firebaseUID: "mockFirebaseUserID"});
        expect(user).not.toBeNull();
        expect(user.first_name).toBe("John");
        expect(user.last_name).toBe("Doe");
        expect(user.email).toBe("test@example.com");
    });    
    
    // Test case for when the user already exists
    it("should return 400 if the user already exists", async() =>{
        // Create a user directly in the database
        await User.create({
            firebaseUID: "mockFirebaseUserID",
            email: "test@example.com",
            first_name: "Existing",
            last_name: "User"
        });
        
        // Attempt to create the same user again
        const res = await request(app)
            .post("/api/users")
            .send({first_name: "John", last_name: "Doe", email:"test@example.com"});
        
        // Verify response status and message
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });     
});
    
