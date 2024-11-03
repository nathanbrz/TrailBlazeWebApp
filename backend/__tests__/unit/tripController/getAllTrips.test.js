const request = require('supertest');
const app = require('../../../server'); // Import the Express app
const Trip = require('../../../dbmodels/trip');

jest.mock('../../../dbmodels/trip'); // Mock the Trip model

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
    req.user = { uid: 'mockUserId' }; // Mock a Firebase UID
    next();
});

describe('Trip Controller - getAllTrips', () => {
    it('should return all trips for a user', async () => {
        // Mock user's saved trips
        const mockTrips = [
            {
                _id: 'mockedTripId1',
                userID: 'mockUserId',
                total_duration: 4,
                start_location: 'Vancouver, BC',
                end_location: 'Toronto, ON',
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
                    }
                ]
            },
            {
                _id: 'mockedTripId2',
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
                            { name: 'Visit Calgary Tower', description: 'Observation deck with panoramic views.' },
                            { name: 'Prince’s Island Park', description: 'A park near the river with picnic areas.' }
                        ],
                        travel_time: 0,
                        notes: 'Explore Calgary’s downtown.'
                    },
                    {
                        day: 2,
                        location: 'Banff, AB',
                        stay: 1,
                        hotel: 'Banff Springs Hotel',
                        activities: [
                            { name: 'Visit Banff National Park', description: 'A stunning national park in the Rockies.' },
                            { name: 'Lake Louise', description: 'A glacial lake surrounded by mountains.' }
                        ],
                        travel_time: 1.5,
                        notes: 'Short drive from Calgary to Banff.'
                    }
                ]
            }
        ];

        Trip.find = jest.fn().mockResolvedValue(mockTrips); // Mock Trip.find method

        const res = await request(app)
            .get('/api/trips')
            .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

        expect(res.statusCode).toEqual(200); // Status 200 for success
        expect(res.body.length).toBe(2); // Expecting two trips in the response
        expect(res.body[0]).toHaveProperty('start_location', 'Vancouver, BC');
        expect(res.body[0]).toHaveProperty('itinerary');
        expect(res.body[0].itinerary[0]).toHaveProperty('location', 'Vancouver, BC');
    });
});
