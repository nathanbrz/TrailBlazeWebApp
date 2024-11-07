require('dotenv').config();
const nock = require("nock");
const { generateItinerary } = require("../../services/openaiService");

describe("generateItinerary Integration Test", () => {
  it("should return a parsed itinerary from the OpenAI API response", async () => {
    // Call the function and check the output
    const itinerary = await generateItinerary("Vancouver, BC", "Banff, AB", 4, "Nature");

    // Validate that the response is structured as expected
    expect(itinerary).toHaveProperty("itinerary");
    expect(itinerary.itinerary).toBeInstanceOf(Array);
    expect(itinerary.itinerary[0]).toHaveProperty("day");
    expect(itinerary.itinerary[0]).toHaveProperty("location");
    expect(itinerary.itinerary[0]).toHaveProperty("stay");
    expect(itinerary.itinerary[0]).toHaveProperty("hotel");
    expect(itinerary.itinerary[0]).toHaveProperty("activities");
    expect(itinerary.itinerary[0].activities[0]).toHaveProperty("name");
    expect(itinerary.itinerary[0].activities[0]).toHaveProperty("description");
  });

  it("should throw an error if the OpenAI API call fails", async () => {
    // Set up nock to intercept the OpenAI API call and simulate a failure
    nock("https://api.openai.com")
      .post("/v1/chat/completions")
      .replyWithError("API call failed");

    // Execute the test and expect it to throw an error
    await expect(generateItinerary("Vancouver, BC", "Banff, AB", 4, "Nature"))
      .rejects.toThrow("Failed to generate itinerary");

    // Clean up nock for other tests
    nock.cleanAll();
  });
});
