import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { doCreateUserWithEmailAndPassword } from '../app/firebase/auth.js';
import { useApi } from '../app/hooks/useApi.js';

jest.mock("../app/hooks/useApi", () => ({
    useApi: jest.fn(() => ({
        fetchData: jest.fn(),
        error: null,
        responseStatus: 200, 
    })),
}));

jest.mock('../app/firebase/auth', () => ({
    doCreateUserWithEmailAndPassword: jest.fn().mockResolvedValue({
        user: {
            getIdToken: jest.fn().mockResolvedValue('mocked-token'),
            uid: 'mocked-uid',
        },
    }),
    initializeApp: jest.fn(),
    getAuth: jest.fn(() => ({
        signInWithEmailAndPassword: jest.fn(),
    })),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));
