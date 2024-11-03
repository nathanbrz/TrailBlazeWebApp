import fetchMock from 'jest-fetch-mock';

// Enable the mock globally
fetchMock.enableMocks(); 

// At the top of your test file
beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterAll(() => {
    console.log.mockRestore(); // Restore original console.log after tests
  });

// Reset mocks before each test
beforeEach(() => {
  fetch.resetMocks(); 
});
