const request = require("supertest");
const app = require("../../server"); // Import your Express app
const admin = require("../../firebaseAdmin/config");

// Mock the Firebase Admin SDK
jest.mock("../../firebaseAdmin/config", () => {
  const verifyIdTokenMock = jest.fn();
  return {
    auth: () => ({
      verifyIdToken: verifyIdTokenMock, // Use the mock function
    }),
  };
});

describe("POST /api/firebase/session - Firebase Middleware Integration Test", () => {
  let verifyIdTokenMock;

  beforeEach(() => {
    // Get the mock function for `verifyIdToken`
    verifyIdTokenMock = admin.auth().verifyIdToken;
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).post("/api/firebase/session");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized access, token required");
  });

  it("should return 401 if the token is invalid", async () => {
    // Set the mock to reject with an error for an invalid token
    verifyIdTokenMock.mockRejectedValue(new Error("Invalid token"));

    const response = await request(app)
      .post("/api/firebase/session")
      .set("Authorization", "Bearer invalidToken");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized access, invalid token");
  });

  it("should return 200 and the user ID if the token is valid", async () => {
    // Set the mock to resolve with a valid decoded token
    const mockDecodedToken = { uid: "12345", email: "test@example.com" };
    verifyIdTokenMock.mockResolvedValue(mockDecodedToken);

    const response = await request(app)
      .post("/api/firebase/session")
      .set("Authorization", "Bearer validToken");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("message", "Verified Token and session established");
    expect(response.body).toHaveProperty("uid", "12345");
  });
});
