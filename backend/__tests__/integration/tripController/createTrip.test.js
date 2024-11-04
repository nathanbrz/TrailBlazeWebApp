const request = require('supertest');
const app = require('../../../server');
const Trip = require('../../../dbmodels/trip');
const { generateItinerary } = require('../../../services/openaiService');

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
  req.user = { uid: 'mockUserId' }; // Mock a Firebase UID
  next();
});

describe('Trip Controller - createTrip (Integration Test)', () => {
  beforeEach(async () => {
    // This will run before each test, ensuring a clean state
  });

  it('should create a new trip and save it to the database', async () => {
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
    expect(res.body).toHaveProperty('start_location', 'Vancouver, BC');
    expect(res.body).toHaveProperty('end_location', 'Banff, AB');

    // Check if the trip is saved in the database
    const savedTrip = await Trip.findById(res.body._id);
    expect(savedTrip).not.toBeNull(); // Ensure the trip is actually saved
    expect(savedTrip.start_location).toBe('Vancouver, BC');
    expect(savedTrip.end_location).toBe('Banff, AB');
  });

  it('should return 400 if there is an error saving the trip', async () => {
    // Mock Trip.prototype.save to throw an error
    jest.spyOn(Trip.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Failed to save trip');
    });

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
    expect(res.statusCode).toEqual(400); 
    expect(res.body).toHaveProperty('error', 'Failed to save trip'); // Check for the error message
  });
});
