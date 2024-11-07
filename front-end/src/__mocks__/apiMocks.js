import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import {
  doCreateUserWithEmailAndPassword,
  doSignInUserWithEmailAndPassword,
} from "../app/firebase/auth";
import { useApi } from "../app/hooks/useApi.js";
import { useRouter } from "next/router.js";
import {
  onIdTokenChanged,
  doUpdateEmail,
  doNameChange,
  doSignOut,
  doPasswordChange,
} from "firebase/auth";
import withAuth from "@/app/components/withAuth";

// Creating a mock function for the useAPI
jest.mock("../app/hooks/useApi", () => ({
  useApi: jest.fn(() => ({
    fetchData: jest.fn(),
    error: null,
    responseStatus: 200,
  })),
}));

// Mock function for the firebase config
jest.mock("../app/firebase/config", () => ({
  firebaseConfig: {
    apiKey: "mocked-api-key",
    authDomain: "mocked-auth-domain",
    projectId: "mocked-project-id",
    storageBucket: "mocked-storage-bucket",
    messagingSenderId: "mocked-messaging-sender-id",
    appId: "mocked-app-id",
  },
}));

// Mock function for firebase API functions
jest.mock("../app/firebase/auth", () => ({
  // Mock function for doCreateUserWithEmail
  doCreateUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {
      getIdToken: jest.fn().mockResolvedValue("mocked-token"),
      uid: "mocked-uid",
    },
  }),

  onIdTokenChanged: jest.fn((auth, callback) => {
    // Call the callback immediately with a mocked user object
    callback({ getIdToken: jest.fn(() => Promise.resolve("mocked-token")) });
    return jest.fn(); // Return a mock unsubscribe function
  }),

  // Mock function for signInWithEmailAndPassword
  doSignInUserWithEmailAndPassword: jest.fn().mockResolvedValue({
    user: {
      uid: "mocked-uid",
      email: "user@example.com",
      displayName: "Mock User",
      getIdToken: jest.fn().mockResolvedValue("mocked-token"),
    },
  }),

  // Mock function for settings page password change
  doPasswordChange: jest.fn(),

  // Mock function for settings page doSignout
  doSignOut: jest.fn(),

  // Mock function for settings page deleting a user
  doDeleteUser: jest.fn(),

  // Mock function for settings page changing users email
  doUpdateEmail: jest.fn(),

  initializeApp: jest.fn(),
  getAuth: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
  })),
}));

// Mock function for the navigation call
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mocking the GenericNav for the settings page
jest.mock("../app/components/GenericNav", () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div>Mocked GenericNav</div>),
  };
});

// Mock function for the navigation call
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    query: { id: 123 },
    push: jest.fn(),
  })),
}));

jest.mock("@/app/components/withAuth", () => jest.fn((Component) => Component));
