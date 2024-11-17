/**
 * Delete User Test
 * This file contains integration tests for user deletion, including:
 * TC-007-BE: Confirm user account deletes from database when user deletes account
 */

const request = require('supertest');
const app = require('../../../server');
const User = require('../../../dbmodels/user');
const Trip = require('../../../dbmodels/trip');
const admin = require("../../../firebaseAdmin/config");

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
    req.user = { uid: "mockFirebaseUserID", email: "test@example.com" }; // Mock a Firebase UID
    next();
  });

// Mock Firebase Admin SDK  
jest.mock("../../../firebaseAdmin/config", () => ({
  auth: () => ({
    // Mock successful deletion
    deleteUser: jest.fn().mockResolvedValue(true), 
  }),
}));  

describe("deleteUser (Integration Test: userController, Database, and Mocked Authentication)", () => {
     // Clean up the database before each test 
     beforeEach(async () => {
        await User.deleteMany({});
        await Trip.deleteMany({});
    });

    // Test case for deleting a user
    it("should delete the user", async () => {
        // Create a user directly in the database
        await User.create({
            firebaseUID: "mockFirebaseUserID",
            email: "test@example.com",
            first_name: "John",
            last_name: "Doe"
        });
        
        // Create a trip associated with the user
        await Trip.create({
          userID: "mockFirebaseUserID",
          tripName: "Test Trip",
        });

        const res = await request(app).delete("/api/users/mockFirebaseUserID");
        
        // Verify response status and message
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User deleted successfully");

        // Check that the user was removed from the database
        const user = await User.findOne({firebaseUID: "mockFirebaseUserID"});
        expect(user).toBeNull();
        const trips = await Trip.find({ userID: "mockFirebaseUID" });
        expect(trips.length).toBe(0);
    });

    // Test case when the user is not found
    it("should return 404 if the user is not found", async () => {
        const response = await request(app).delete("/api/users/nonexistentUserID");

        // Verify response status and message
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
  });

    // Test case to handle database error 
    it("should handle database error and return error code 500", async () => {
      jest.spyOn(Trip, "deleteMany").mockRejectedValueOnce(new Error("Database error"));
  
      await User.create({
        firebaseUID: "mockFirebaseUserID",
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
      });

      await Trip.create({
        userID: "mockFirebaseUserID",
        tripName: "Test Trip",
      });
  
      const res = await request(app).delete("/api/users/mockFirebaseUserID");
  
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error deleting user");
    });
});