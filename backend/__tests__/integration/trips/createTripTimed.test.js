/**
 *
 * This file contains performance tests for trip creation, including:
 * - TC-016: Verify the system receives a response from the LLM within 15 seconds
 *
 * The tests measure response time for generating itineraries with large inputs
 * to ensure the system meets performance requirements.
 *
 */

const request = require('supertest');
const app = require('../../../server');
const Trip = require('../../../dbmodels/trip');

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
  req.user = { uid: 'mockUserId' }; // Mock a Firebase UID
  next();
});

describe('POST /api/trips - Performance Test for Trip Generation Time', () => {
  beforeEach(async () => {
    // This will run before each test, ensuring a clean state
  });

  it('should generate a 21-day trip itinerary and respond within 10 seconds', async () => {
    // Start timing
    const startTime = Date.now();

    // Send the request to create a new trip with the maximum duration (21 days)
    const res = await request(app)
      .post('/api/trips')
      .send({
        name: 'Nature Vibes',
        start_location: 'Vancouver, BC',
        end_location: 'Banff, AB',
        total_duration: 21, // Maximum duration 
        trip_interest: 'Nature',
      })
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    // Calculate elapsed time
    const elapsedTime = Date.now() - startTime;

    // Assertions
    expect(res.statusCode).toEqual(201); // Check that the trip was created successfully
    expect(elapsedTime).toBeLessThanOrEqual(10000); // Assert that it completes within 10 seconds

    // Additional checks on the response body
    expect(res.body).toHaveProperty('_id'); // Check that the trip has an ID
    expect(res.body).toHaveProperty('start_location', 'Vancouver, BC');
    expect(res.body).toHaveProperty('end_location', 'Banff, AB');
    expect(res.body).toHaveProperty('total_duration', 21); // Verify trip duration
  });
});
