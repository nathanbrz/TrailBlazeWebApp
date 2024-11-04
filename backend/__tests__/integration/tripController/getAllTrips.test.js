const request = require('supertest');
const app = require('../../../server'); // Import the Express app
const Trip = require('../../../dbmodels/trip');

// Mock Firebase middleware to provide a mock user ID
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
  req.user = { uid: 'mockUserId' }; // Mock a Firebase UID
  next();
});

describe('Trip Controller - getAllTrips (Integration Test)', () => {
  // Add some mock trips to the database before each test
  beforeEach(async () => {
    // Add mock trips to the test database
    await Trip.create([
      {
        userID: 'mockUserId',
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
              {
                name: 'Visit Stanley Park',
                description: 'A large urban park with gardens, trails, and beaches.',
              },
              {
                name: 'Explore Granville Island',
                description: 'A vibrant area with public markets, shops, and food spots.',
              },
            ],
            travel_time: 0,
            notes: 'Enjoy Vancouver’s urban nature spots.',
          },
          {
            day: 3,
            location: 'Banff, AB',
            stay: 1,
            hotel: 'Banff Springs Hotel',
            activities: [
              {
                name: 'Visit Banff National Park',
                description: 'A stunning national park in the Rockies.',
              },
              {
                name: 'Hike Johnston Canyon',
                description: 'A beautiful hike with waterfalls.',
              },
            ],
            travel_time: 10,
            notes: 'Drive through the Rocky Mountains to Banff.',
          },
        ],
      },
      {
        userID: 'mockUserId',
        total_duration: 3,
        start_location: 'Calgary, AB',
        end_location: 'Banff, AB',
        trip_interest: 'Nature',
        itinerary: [
          {
            day: 1,
            location: 'Calgary, AB',
            stay: 1,
            hotel: 'Hotel Arts',
            activities: [
              {
                name: 'Visit Calgary Tower',
                description: 'Observation deck with panoramic views.',
              },
              {
                name: 'Prince’s Island Park',
                description: 'A park near the river with picnic areas.',
              },
            ],
            travel_time: 0,
            notes: 'Explore Calgary’s downtown.',
          },
          {
            day: 2,
            location: 'Banff, AB',
            stay: 1,
            hotel: 'Banff Springs Hotel',
            activities: [
              {
                name: 'Visit Banff National Park',
                description: 'A stunning national park in the Rockies.',
              },
              {
                name: 'Lake Louise',
                description: 'A glacial lake surrounded by mountains.',
              },
            ],
            travel_time: 1.5,
            notes: 'Short drive from Calgary to Banff.',
          },
        ],
      },
    ]);
  });

  // Clean up the database after each test
  afterEach(async () => {
    await Trip.deleteMany({ userID: 'mockUserId' }); // Delete all trips created for the mock user
  });

  it('should return all trips for a user', async () => {
    // Make a GET request to the /api/trips endpoint
    const res = await request(app)
      .get('/api/trips')
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    // Assertions
    expect(res.statusCode).toEqual(200); // Status code 200 for success
    expect(res.body).toHaveLength(2); // Expecting two trips in the response
    expect(res.body[0]).toHaveProperty('start_location', 'Vancouver, BC');
    expect(res.body[0]).toHaveProperty('itinerary');
    expect(res.body[1]).toHaveProperty('start_location', 'Calgary, AB');
    expect(res.body[1].itinerary).toHaveLength(2); // Check itinerary length
  });

  it('should return 500 if there is a server error', async () => {
    // Force an error by mocking Trip.find to throw an error
    jest.spyOn(Trip, 'find').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const res = await request(app)
      .get('/api/trips')
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    expect(res.statusCode).toEqual(500); // Status code 500 for server error
    expect(res.body).toHaveProperty('error', 'Database error');
  });
});
