const OpenAI = require("openai");
const { generateItinerary } = require("../../services/openaiService");

// Mock the OpenAI class
jest.mock("openai", () => {
  // Create a mock for the create method
  const createMock = jest.fn();
  // Return a mock implementation of the OpenAI class
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: createMock,
      },
    },
  }));
});

describe("generateItinerary Unit Test", () => {
  let createMock;

  beforeEach(() => {
    // Retrieve the mocked create method
    createMock = OpenAI().chat.completions.create;
  });

  it("should return a parsed itinerary from the OpenAI API response", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
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
                },
              ],
            }),
          },
        },
      ],
    };

    // Use the createMock method to set the mock response
    createMock.mockResolvedValue(mockResponse);

    // Call the function and check the output
    const itinerary = await generateItinerary("Vancouver, BC", "Banff, AB", 4, "Nature");

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(itinerary).toEqual({
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
        },
      ],
    });
  });

  it("should throw an error if the OpenAI API call fails", async () => {
    createMock.mockRejectedValue(new Error("API call failed"));

    await expect(generateItinerary("Vancouver, BC", "Banff, AB", 4, "Nature")).rejects.toThrow("Failed to generate itinerary");
  });
});
