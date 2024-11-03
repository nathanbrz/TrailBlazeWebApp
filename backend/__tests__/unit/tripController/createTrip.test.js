const request = require('supertest');
const app = require('../../../server'); // Import the Express app
const Trip = require('../../../dbmodels/trip');
const Stop = require('../../../dbmodels/stop');
const { generateItinerary } = require('../../../services/openaiService'); // Import the open ai service

jest.mock('../../../dbmodels/trip'); // Mock the Trip model
jest.mock('../../../dbmodels/stop'); // Mock the Stop model

// Mock Firebase middleware
jest.mock('../../../middleware/firebaseMiddleware', () => (req, res, next) => {
    req.user = { uid: 'mockUserId' }; // Mock a Firebase UID
    next();
});

// Mock the generateItinerary function from openaiService
jest.mock('../../../services/openaiService', () => ({
    generateItinerary: jest.fn(), 
}));

describe('Trip Controller - createTrip', () => {
    it('should create a new trip and return it', async () => {
        // Mock itinerary returned by generateItinerary
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

        generateItinerary.mockResolvedValue(mockItinerary); // Mock the return value of generateItinerary

        // Mock the Stop model constructor
        Stop.mockImplementation((stopData) => ({ ...stopData }));

        // Mock the Trip model constructor to simulate behavior of a Trip instance being created and then saved
        Trip.mockImplementation((tripData) => ({
            ...tripData,
            save: jest.fn().mockResolvedValue({ ...tripData, _id: "mockTripId" }),
        }));

        const res = await request(app)
            .post('/api/trips')
            .send({
                start_location: 'Vancouver, BC',
                end_location: 'Banff, AB',
                total_duration: 4,
                trip_interest: 'Nature'
            })
            .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

        expect(res.statusCode).toEqual(201); // Expecting status code 201 (Created)
        expect(res.body).toHaveProperty('itinerary'); // Check if itinerary is included
        expect(res.body).toHaveProperty('userID', 'mockUserId'); // Check if userID is correct
        expect(res.body).toHaveProperty('start_location', 'Vancouver, BC'); // Check the start location
        expect(res.body).toHaveProperty('end_location', 'Banff, AB'); // Check the end location
        expect(res.body.itinerary[1]).toHaveProperty('hotel', 'Banff Springs Hotel'); // Check itinerary details
    });

    it('should return 400 if there is an error creating the trip', async () => {
        // Mock generateItinerary to throw an error
        generateItinerary.mockRejectedValue(new Error('Failed to generate itinerary'));

        const res = await request(app)
            .post('/api/trips')
            .send({
                start_location: 'Vancouver, BC',
                end_location: 'Banff, AB',
                total_duration: 4,
                trip_interest: 'Nature'
            })
            .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token

        expect(res.statusCode).toEqual(400); // Expecting status code 400 (Bad Request)
        expect(res.body).toHaveProperty('error', 'Failed to generate itinerary'); // Check for the error message
    });
});
