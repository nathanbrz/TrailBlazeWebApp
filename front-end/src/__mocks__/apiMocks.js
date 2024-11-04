import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { doCreateUserWithEmailAndPassword, doSignInUserWithEmailAndPassword } from '../app/firebase/auth.js';
import { useApi } from '../app/hooks/useApi.js';
import { useRouter } from 'next/router.js';

// Creating a mock function for the useAPI 
jest.mock("../app/hooks/useApi", () => ({
    useApi: jest.fn(() => ({
        fetchData: jest.fn(),
        error: null,
        responseStatus: 200, 
    })),
}));

// Mock function for firebase API functions
jest.mock('../app/firebase/auth', () => ({

    // Mock function for doCreateUserWithEmail
    doCreateUserWithEmailAndPassword: jest.fn().mockResolvedValue({
        user: {
            getIdToken: jest.fn().mockResolvedValue('mocked-token'),
            uid: 'mocked-uid',
        },
    }),

    // Mock function for signInWithEmailAndPassword
    doSignInUserWithEmailAndPassword: jest.fn().mockResolvedValue({
        user: {
            uid: 'mocked-uid',
            email: 'user@example.com',
            displayName: 'Mock User',
            getIdToken: jest.fn().mockResolvedValue('mocked-token')
        }
    }),
    initializeApp: jest.fn(),
    getAuth: jest.fn(() => ({
        signInWithEmailAndPassword: jest.fn(),
    })),
}));

// Mock function for the navigation call
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

// Mock function for the navigation call
jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));



