const request = require('supertest');
const app = require('../../server'); // Import the Express app
const Trip = require('../../dbmodels/trip');
jest.mock('../../dbmodels/trip'); // Mock the Trip model

// Mock Firebase middleware
jest.mock('../../middleware/firebaseMiddleware', () => (req, res, next) => {
    req.user = { uid: 'mockUserId' }; // Mock a Firebase UID
    next();
});

describe('Trip Routes', () => {
    describe('POST /trips', () => {
        it('should create a new trip', async () => {
            // Mocking the save method of the Trip model
            const mockTrip = {
                _id: 'mockedTripId',
                promptID: 'mockedPromptId',
                userID: 'mockUserId',  // Firebase UID
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
            
            Trip.prototype.save = jest.fn().mockResolvedValue(mockTrip); // Mock save method

            const res = await request(app)
                .post('/api/trips')
                .send({
                    promptID: 'mockedPromptId',
                    start_location: 'Vancouver, BC',
                    end_location: 'Toronto, ON',
                    total_duration: 7,
                    trip_interest: 'Nature'
                })
                .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token
            
            expect(res.statusCode).toEqual(201); // Expecting status code 201 (Created)
            expect(res.body).toHaveProperty('start_location', 'Vancouver, BC'); // Check the start location
            expect(res.body).toHaveProperty('end_location', 'Toronto, ON'); // Check the end location
            expect(res.body).toHaveProperty('userID', 'mockUserId'); // Check if userID is correct
            expect(res.body).toHaveProperty('itinerary'); // Check if itinerary is included
            expect(res.body.itinerary[0]).toHaveProperty('location', 'Vancouver, BC'); // Check itinerary details
        }, 100000);

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/trips')
                .send({}) // Sending an empty body
                .set('Authorization', 'Bearer mockFirebaseToken'); // Mock token
            
            expect(res.statusCode).toEqual(400); // Expect 400 Bad Request due to missing fields
        });
    }, 10000);

    describe('GET /trips', () => {
        it('should return all trips for a user', async () => {
            const mockTrips = [
                {
                    _id: 'mockedTripId1',
                    promptID: 'mockedPromptId1',
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
                    promptID: 'mockedPromptId2',
                    userID: 'mockUserId', 
                    total_duration: 4,
                    start_location: 'Calgary, AB',
                    end_location: 'Banff, AB',
                    total_duration: 2,
                    trip_interest: 'Nature',
                    userID: 'mockUserId',
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
        }, 10000);
    });
});
