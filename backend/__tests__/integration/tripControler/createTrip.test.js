const request = require('supertest');
const app = require('../../../server'); 
const Trip = require('../../../dbmodels/trip');
const { generateItinerary } = require('../../../services/openaiService'); 

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
    req.user = { uid: 'mockUserId' }; // Mock a Firebase UID
    next();
});

// Mock the generateItinerary function
jest.mock('../../../services/openaiService', () => ({
  generateItinerary: jest.fn(),
}));

describe('Trip Controller - createTrip (Integration Test)', () => {
  beforeEach(async () => {
    // This will run before each test, ensuring a clean state
  });

  it('should create a new trip and save it to the database', async () => {
    // Mock itinerary returned by the generateItinerary function
    const mockItinerary = {
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
      ]
    };

    generateItinerary.mockResolvedValue(mockItinerary); // Mock the return value

    // Make a request to create a new trip
    const res = await request(app)
      .post('/api/trips')
      .send({
        start_location: 'Vancouver, BC',
        end_location: 'Banff, AB',
        total_duration: 4,
        trip_interest: 'Nature',
      })
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    // Assertions
    expect(res.statusCode).toEqual(201); // Status code 201 for Created
    expect(res.body).toHaveProperty('_id'); // Check that the trip has an ID
    expect(res.body).toHaveProperty('userID', 'mockUserId'); // Check user ID
    expect(res.body).toHaveProperty('start_location', 'Vancouver, BC'); // Check start location
    expect(res.body).toHaveProperty('end_location', 'Banff, AB'); // Check end location
    expect(res.body.itinerary).toHaveLength(2); // Check that there are two itinerary stops

    // Check if the trip is saved in the database
    const savedTrip = await Trip.findById(res.body._id);
    expect(savedTrip).not.toBeNull(); // Ensure the trip is actually saved
    expect(savedTrip.start_location).toBe('Vancouver, BC'); // Verify the saved data
    expect(savedTrip.end_location).toBe('Banff, AB');
  });

  it('should return 400 if there is a validation error', async () => {
    // Mock generateItinerary to throw an error
    generateItinerary.mockRejectedValue(new Error('Failed to create new trip'));

    const res = await request(app)
        .post('/api/trips')
        .send({
            start_location: 'Vancouver, BC',
            end_location: 'Banff, AB',
            total_duration: 4,
            trip_interest: 'Nature'
        })
        .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    expect(res.statusCode).toEqual(400); // Expect a 400 Bad Request status
    expect(res.body).toHaveProperty('error'); // Expect an error message
  });
});