const OpenAI = require("openai");
const Stop = require("../dbmodels/stop");

// Set up API client with the OpenAI API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a travel itinerary by interacting with the OpenAI API
const generateItinerary = async (
  start_location,
  end_location,
  duration,
  interest
) => {
  try {
    // Send a prompt to OpenAI to generate an itinerary based on user-provided information
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        // System message to set the AI's role
        {
          role: "system",
          content:
            "You are a North American road trip travel itinerary generator.",
        },

        // User message with itinerary request and formatting instructions
        {
          role: "user",
          content: `I am going on a North American road trip. I am traveling from ${start_location} to ${end_location} over the course of ${duration} days. 
                Can you generate a trip itinerary with places to stay along the way, recommended time to spend at each stop, 
                travel time between stops, and activities to do at each stop with a brief description of the activity. 
                The activities should cater to ${interest} interests. Return your response in the following JSON format:
                {
                    "itinerary": [
                        {
                            "day": "the day of the trip, in days",
                            "location": "the city, province/state",
                            "stay": "the number of nights at this location, in nights",
                            "hotel": "name of hotel",
                            "activities": [
                                {"name": "Name of Activity", "description": "a brief description of the activity"},
                                {"name": "Name of Activity", "description": "a brief description of the activity"},
                                {"name": "Name of Activity", "description": "a brief description of the activity"}
                            ],
                            "travel_time": "driving time in hours to this stop, from the previous stop",
                            "notes": "Any other information that may be relevant about this stop"
                        },
                    ]
                }
                Do not return any non .JSON text or numbering.`,
        },
      ],
      max_completion_tokens: 1500,

      // Define a response format, ensuring the output matches the JSON schema
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "trip_itinerary",
          schema: {
            type: "object",
            properties: {
              itinerary: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    day: { type: "string" },
                    location: { type: "string" },
                    stay: { type: "string" },
                    hotel: { type: "string" },
                    activities: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          description: { type: "string" },
                        },
                        required: ["name", "description"],
                      },
                    },
                    travel_time: { type: "string" },
                    notes: { type: "string" },
                  },
                  required: [
                    "day",
                    "location",
                    "stay",
                    "hotel",
                    "activities",
                    "travel_time",
                    "notes",
                  ],
                },
              },
            },
            required: ["itinerary"],
          },
        },
      },
    });

    // Parse the response to extract the generated itinerary
    const itinerary = JSON.parse(response.choices[0].message.content);
    return itinerary;
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    throw new Error("Failed to generate itinerary");
  }
};

//TODO: Implement check to re-prompt openai if response can't be parsed to JSON

module.exports = { generateItinerary };
