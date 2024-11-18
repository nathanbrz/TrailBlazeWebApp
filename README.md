# Trailblaze

Trailblaze is a web application that enables users to plan, track, and view statistics about their trips. This project is structured with a MERN stack (MongoDB, Express, React, Node.js) and includes features for user authentication, personalized trip data, and statistics visualization.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Firebase Setup](#firebase-setup)
- [Usage](#usage)
- [API Details](#api-details)
- [Folder Structure](#folder-structure)
- [Scripts](#scripts)
- [Testing](#testing)
- [External Integrations](#external-integrations)
- [Demo](#demo)

## Project Overview
Trailblaze allows users to create and manage their trip itineraries with features that provide insights and statistics on their travels. This project is designed for personal travel planning and viewing trip-related data, such as the total trips taken, average trip length, and most popular trip style.

## Features
- **User Authentication**: Signup and login with authentication tokens.
- **Trip Management**: Create, update, and delete trips.
- **Statistics Dashboard**: View key trip statistics, such as the total trips, average trip length, and most popular trip styles.
- **Responsive Design**: Mobile-friendly interface.

## Getting Started
Note: You can view a live demo of our app by visiting https://trailblaze-webapp.vercel.app/ 
### Prerequisites
- **Node.js** (version 14.2.11 or higher)
- **MongoDB** (Local or hosted database, e.g., MongoDB Atlas)
- **Git**

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/Trailblaze.git
   cd Trailblaze

2. **Install Dependencies**:
   ```bash
    npm install
    cd front-end
    npm install
    cd ../backend
    npm install
   ```

3. **Setup MongoDB**:
   Create a MongoDB database and obtain the connection string.

### Environment Variables
Create a .env file in the backend directory with the following variables:

```dotenv
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
FRONT_END_URL=http://localhost
FRONT_END_PORT=3001
PORT=4000
```
### Firebase Setup

To enable user authentication with Firebase, follow these steps:

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable **Authentication** in the Firebase Console and set up your desired sign-in methods (e.g., Email/Password).

2. **Get Firebase Config**:
   - In the Firebase Console, go to **Project Settings** > **General** and locate your Firebase SDK configuration.
   - Copy the Firebase configuration values.

3. **Configure Firebase in Your Project**:
   - Create a `firebaseConfig.js` file in the frontend `src` folder to store your Firebase configuration:
     ```javascript
     // src/firebaseConfig.js
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";

     const firebaseConfig = {
       apiKey: "your_api_key",
       authDomain: "your_auth_domain",
       projectId: "your_project_id",
       storageBucket: "your_storage_bucket",
       messagingSenderId: "your_messaging_sender_id",
       appId: "your_app_id"
     };

     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     ```

4. **Add Firebase Admin SDK for Backend**:
   - Install Firebase Admin SDK in your backend:
     ```bash
     npm install firebase-admin
     ```
   - Configure Firebase Admin in `backend/firebaseAdmin/config.js`:
     ```javascript
     // backend/firebaseAdmin/config.js
     const admin = require("firebase-admin");
     const serviceAccount = require("../path/to/your-service-account-file.json");

     admin.initializeApp({
       credential: admin.credential.cert(serviceAccount)
     });

     module.exports = admin;
     ```
   - Download your **Service Account Key** from **Project Settings > Service Accounts** in the Firebase Console, and save it in the `backend` directory. Update the path accordingly in the code above.

5. **Environment Variables for Firebase**:
   - Update the `.env` file in your backend to include any Firebase-specific configuration if needed.
   
Following these steps should get Firebase authentication running for both the frontend and backend of your application.

## Usage
To run the app locally:

1. **Start the Server**:
   ```bash
   cd backend
   npm run dev
   ```
2.	**Access the app**:
- Backend runs on http://localhost:4000
- Frontend runs on http://localhost:3001


## API Details
Trailblaze uses a set of RESTful endpoints for managing user accounts, trips, and overview statistics, with Firebase Admin SDK handling backend authentication. Each route is protected with `authenticateUser` middleware, verifying Firebase ID tokens before granting access.

#### Authentication Middleware
- **Firebase ID Token Verification**: The `authenticateUser` middleware extracts and verifies the ID token from the `Authorization` header (format: `Bearer <token>`). Upon successful verification, it attaches user information to the request object for further use.

#### Key Endpoints

| Endpoint                         | Method | Description                                             |
|----------------------------------|--------|---------------------------------------------------------|
| **Session Route**                |        |                                                         |
| `/api/firebase/session`          | POST   | Establishes a session if the token is valid.            |
| **User Routes**                  |        |                                                         |
| `/api/users`                     | POST   | Create a new user.                                      |
| `/api/users/:firebaseUID`        | GET    | Retrieve user details by Firebase UID.                  |
| `/api/users/names`               | PUT    | Update a user’s name.                                   |
| `/api/users/email`               | PUT    | Update a user’s email.                                  |
| `/api/users/:firebaseUID`        | DELETE | Delete a user by Firebase UID.                          |
| **Trip Routes**                  |        |                                                         |
| `/api/trips`                     | POST   | Create a new trip.                                      |
| `/api/trips`                     | GET    | Get all trips for the authenticated user.               |
| `/api/trips/:id`                 | PUT    | Update the name of a specific trip.                     |
| `/api/trips/:id`                 | DELETE | Delete a specific trip.                                 |
| **Overview Routes**              |        |                                                         |
| `/api/overview/totalTripsCreated`| GET    | Retrieve the total number of trips created.             |
| Additional overview endpoints    | GET    | Retrieve average trip length, most popular trip style, and total user count. |

## Folder Structure
The Trailblaze project is organized as follows:
```plaintext
TrailBlazeWebApp
├── README.md                # Main project README
├── backend                  # Backend folder (Express.js API)
│   ├── README.md
│   ├── tests            # Tests for backend
│   ├── controllers          # Controllers for handling requests
│   ├── dbmodels             # MongoDB models
│   ├── firebaseAdmin        # Firebase configuration and setup
│   ├── jest.config.js       # Jest configuration for backend testing
│   ├── middleware           # Authentication and other middleware
│   ├── routes               # API routes
│   ├── server.js            # Main server file
│   ├── services             # External services (e.g., OpenAI)
│   └── testSetup            # Setup files for testing
├── front-end                # Frontend folder (React/Next.js)
│   ├── README.md
│   ├── jest.config.js       # Jest configuration for frontend testing
│   ├── jsconfig.json        # JavaScript configuration
│   ├── next.config.mjs      # Next.js configuration
│   ├── public               # Static assets
│   ├── src                  # Source files for components, pages, etc.
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── postcss.config.js    # PostCSS configuration
├── package-lock.json
└── package.json
```
This layout includes:
- **Backend**: Manages API endpoints, database models, Firebase authentication, and external integrations.
- **Frontend**: Contains Next.js application files, including components, pages, and styling configurations.

## Scripts

To manage and run the Trailblaze application, the following npm scripts are available:

- **`npm run dev`**: Starts the application in development mode. This runs both the backend (on `http://localhost:4000`) and the frontend (on `http://localhost:3001`).
- **`npm start`**: Starts the application in production mode.

Make sure to set up the appropriate environment variables in a `.env` file for local development.

## Testing

Trailblaze uses **Jest** for both backend and frontend testing. The tests cover integration with the database, authentication, and API endpoints, as well as frontend form validations and interactions.

### Backend Testing
- **In-Memory MongoDB Server**: The backend tests use an in-memory MongoDB server for isolation, ensuring no interference with production data.
- **Integration Tests**:
  - `POST /api/trips`: Creates a new trip using OpenAI API and validates it in the database.
  - `DELETE /api/trips/:id`: Deletes a specific trip and checks for successful deletion.
  - `POST /api/firebase/session`: Tests Firebase token validation for session management.
  - `GET /api/trips`: Retrieves all trips for a user with integration testing.
- **Unit Tests**:
  - `generateItinerary`: Tests OpenAI's API integration to ensure correct itinerary generation and error handling.

### Frontend Testing
- **Form Handling and Validation**: Validates form inputs for login and signup pages, checking for correct handling of:
  - Valid/invalid email formats
  - Password requirements
  - Empty fields and error messages
- **Mocking**: Firebase and API calls are mocked to simulate expected responses and errors.

To run the tests, use the following command:
```bash
npm test
```

## External Integrations
Trailblaze integrates with the following external services:

- **Firebase**: Used for frontend authentication and backend token verification to secure user actions within the app.
- **OpenAI**: Provides AI-driven travel itinerary generation. The `generateItinerary` function uses OpenAI's API to create custom North American road trip itineraries based on the user's start location, end location, travel duration, and interests. This response is structured in JSON format to include daily travel plans, hotel recommendations, activities, and travel times.

### Configuration
- **Environment Variables**: Ensure the following variables are defined in your `.env` file:
  ```env
  OPENAI_API_KEY=your_openai_api_key
  ```
## Demo
You can view a live demo of our app by visiting https://trailblaze-webapp.vercel.app/ 

Check out a quick demo of Trailblaze in action!

![Trailblaze Demo](path/to/demo.gif)

To create the GIF:
1. Use a screen recording tool (like [ScreenToGif](https://www.screentogif.com/) or similar) to capture the user flow you’d like to showcase (e.g., trip creation, dashboard navigation).
2. Export the recording as a GIF.
3. Add it to the repository (e.g., `assets/demo.gif`) and update the file path in the README.
