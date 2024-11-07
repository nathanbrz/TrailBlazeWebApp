import fetchMock from "jest-fetch-mock";

// Enable the mock globally
fetchMock.enableMocks();

// Disabling console logs for the test (for readability sake)
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

// Reset the console log after every test
afterAll(() => {
  console.log.mockRestore();
});

// Reset mocks before each test
beforeEach(() => {
  fetch.resetMocks();
  global.scrollTo = jest.fn();
});
