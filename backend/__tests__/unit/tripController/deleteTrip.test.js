const request = require('supertest');
const app = require('../../../server'); // Import the Express app
const Trip = require('../../../dbmodels/trip');

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
  req.user = { uid: 'mockUserId' }; // Mock a Firebase UID
  next();
});

// Mock the Trip model
jest.mock('../../../dbmodels/trip');

describe('Trip Controller - deleteTrip', () => {
  it('should delete a specific trip and return a success message', async () => {
    const mockTripID = 'mockedTripId';
    const mockUserID = 'mockUserId';

    // Mock finding the trip
    Trip.findOne.mockResolvedValue({
      _id: mockTripID,
      userID: mockUserID,
    });

    // Mock deleting the trip
    Trip.deleteOne.mockResolvedValue({});

    const res = await request(app)
      .delete(`/api/trips/${mockTripID}`)
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    expect(res.statusCode).toEqual(200); // Expecting status code 200 (OK)
    expect(res.body).toHaveProperty('message', 'Trip deleted'); // Check for the success message
  });

  it('should return 404 if the trip is not found', async () => {
    const mockTripID = 'nonExistentTripId';

    // Mock finding no trip
    Trip.findOne.mockResolvedValue(null);

    const res = await request(app)
      .delete(`/api/trips/${mockTripID}`)
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    expect(res.statusCode).toEqual(404); // Expecting status code 404 (Not Found)
    expect(res.body).toHaveProperty('error', 'Trip not found'); // Check for the error message
  });

  it('should return 500 if there is a server error', async () => {
    const mockTripID = 'mockedTripId';

    // Mock an error when finding the trip
    Trip.findOne.mockRejectedValue(new Error('Database error'));

    const res = await request(app)
      .delete(`/api/trips/${mockTripID}`)
      .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

    expect(res.statusCode).toEqual(500); // Expecting status code 500 (Internal Server Error)
    expect(res.body).toHaveProperty('error', 'Database error'); // Check for the error message
  });
});
