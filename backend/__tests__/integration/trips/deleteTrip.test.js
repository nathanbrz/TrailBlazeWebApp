const request = require('supertest');
const app = require('../../../server'); // Import the Express app
const Trip = require('../../../dbmodels/trip');

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
  req.user = { uid: 'mockUserId' }; // Mock a Firebase UID for the authenticated user
  next();
});

describe('DELETE /api/trips/:id - Delete Trip Flow (Integration Test: Controller, Database, and Mocked Authentication)', () => {
  let tripId;

  // Set up the test database with a trip before each test
  beforeEach(async () => {
    // Create a mock trip in the test database
    const trip = new Trip({
        userID: 'mockUserId',
        name: 'Nature vibes',
        total_duration: 4,
        start_location: 'Vancouver, BC',
        end_location: 'Banff, AB',
        trip_interest: 'Nature',
        itinerary: [
            {
                day: 1,
                location: 'Vancouver, BC',
                stay: 2,
                hotel: 'Fairmont Pacific Rim',
                activities: [
                    { name: 'Visit Stanley Park', description: 'A large urban park with gardens, trails, and beaches.' },
                    { name: 'Explore Granville Island', description: 'A vibrant area with public markets, shops, and food spots.' }
                ],
                travel_time: 0,
                notes: 'Enjoy Vancouver’s urban nature spots.'
            },
            {
                day: 3,
                location: 'Banff, AB',
                stay: 1,
                hotel: 'Banff Springs Hotel',
                activities: [
                    { name: 'Visit Banff National Park', description: 'A stunning national park in the Rockies.' },
                    { name: 'Hike Johnston Canyon', description: 'A beautiful hike with waterfalls.' }
                ],
                travel_time: 10,
                notes: 'Drive through the Rocky Mountains to Banff.'
            }
        ],
    });

    // Save the trip to the test database and get the ID
    const savedTrip = await trip.save();
    tripId = savedTrip._id;
  });

  // Clean up the test database after each test
  afterEach(async () => {
    await Trip.deleteMany({});
  });

  it('should delete a specific trip and return a success message', async () => {
    // Make a DELETE request to the /api/trips/:id endpoint
    const res = await request(app)
      .delete(`/api/trips/${tripId}`)
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    // Assertions
    expect(res.statusCode).toEqual(200); // Status code 200 for success
    expect(res.body).toHaveProperty('message', 'Trip deleted'); // Check for the success message

    // Verify that the trip has been deleted from the database
    const deletedTrip = await Trip.findById(tripId);
    expect(deletedTrip).toBeNull(); // The trip should no longer exist
  });

  it('should return 404 if the trip is not found', async () => {
    const nonExistentTripId = '60d21b4667d0d8992e610c85'; // Example non-existent ID

    // Make a DELETE request with a non-existent trip ID
    const res = await request(app)
      .delete(`/api/trips/${nonExistentTripId}`)
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    // Assertions
    expect(res.statusCode).toEqual(404); // Status code 404 for Not Found
    expect(res.body).toHaveProperty('error', 'Trip not found'); // Check for the error message
  });

  it('should return 500 if there is a server error', async () => {
    // Simulate a server error by causing Trip.findOne to throw an error
    jest.spyOn(Trip, 'findOne').mockRejectedValueOnce(new Error('Database error'));

    // Make a DELETE request
    const res = await request(app)
      .delete(`/api/trips/${tripId}`)
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    // Assertions
    expect(res.statusCode).toEqual(500); // Status code 500 for Internal Server Error
    expect(res.body).toHaveProperty('error', 'Database error'); // Check for the error message
  });
});
