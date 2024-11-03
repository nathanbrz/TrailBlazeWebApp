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

    // Check if the trip is saved in the database
    const savedTrip = await Trip.findById(res.body._id);
    expect(savedTrip).not.toBeNull(); // Ensure the trip is actually saved
    expect(savedTrip.start_location).toBe('Vancouver, BC'); // Verify the saved data
    expect(savedTrip.end_location).toBe('Banff, AB');
  });
});