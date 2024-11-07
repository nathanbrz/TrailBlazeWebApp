const request = require('supertest');
const app = require('../../server');
const Trip = require('../../dbmodels/trip');

// Mock Firebase middleware
jest.mock('../../middleware/firebaseMiddleware', () => (req, res, next) => {
  req.user = { uid: 'mockUserId' }; // Mock a Firebase UID
  next();
});

describe('PUT /api/trips/:id - Update Trip Name (Integration Test)', () => {
  let trip;

  beforeEach(async () => {
    // Create a trip in the test database before each test
    trip = await Trip.create({
        userID: 'mockUserid',
      name: 'Old Trip Name',
      start_location: 'Vancouver, BC',
      end_location: 'Banff, AB',
      total_duration: 4,
      trip_interest: 'Nature',
      itinerary: [],
    });
  });

  afterEach(async () => {
    // Clean up the test database after each test
    await Trip.deleteMany({});
  });

  it('should update the trip name by ID', async () => {
    const newName = 'Updated Trip Name';

    // Send PUT request to update the trip name
    const res = await request(app)
      .put(`/api/trips/${trip._id}`)
      .send({ name: newName })
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    // Assertions
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Trip updated');

    // Verify the name change in the database
    const updatedTrip = await Trip.findById(trip._id);
    expect(updatedTrip.name).toBe(newName);
  });

  it('should return 500 if trip ID is invalid', async () => {
    const res = await request(app)
      .put('/api/trips/invalidID')
      .send({ name: 'Test Name' })
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error');
  });
});
