const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Start an in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up the database after each test
afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// Stop the in-memory MongoDB server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
