import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '../../../__mocks__/apiMocks'; 
import Signup from '../../signup/page';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { useApi } from '../../hooks/useApi';


describe('Signup Integration Test', () => {
    beforeEach(() => {
        // Reset the mocks before each test
        jest.clearAllMocks();
    });

    // Test if user can successfully sign up
    it('should successfully sign up a user', async () => {
        const mockUserCredential = {
            user: {
                getIdToken: jest.fn().mockResolvedValue('mocked-token'),
                uid: 'mocked-uid',
            },
        };

        // Mocking the createUserWithEmailAndPassword function
        doCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);

        useApi.mockImplementation((url, method) => {
            if (url === 'api/firebase/session' && method === 'POST') {
                return {
                    fetchData: jest.fn().mockResolvedValueOnce({}),
                    error: null,
                    responseStatus: 200,
                };
            } else if (url === 'api/users' && method === 'POST') {
                return {
                    fetchData: jest.fn().mockResolvedValueOnce({}),
                    error: null,
                };
            }
            return { fetchData: jest.fn() };
        });

        const { getByLabelText, getByText, getByRole } = render(<Signup />);

        // Fill out the signup form
        fireEvent.change(getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: 'password123' } });

        // Submit the form
        const signUpButton = getByRole('button', { name: /sign up/i });
        fireEvent.click(signUpButton);

        // Wait for the asynchronous actions to complete
        await waitFor(() => {
            expect(doCreateUserWithEmailAndPassword).toHaveBeenCalledWith('john.doe@example.com', 'password123');
            expect(useApi).toHaveBeenCalledWith('api/firebase/session', 'POST');
            expect(useApi).toHaveBeenCalledWith('api/users', 'POST');
        });
    });

    // Test if error shows when invalid first name is used
    it('should show an error message for invalid first name', async () => {
        const { getByLabelText, getByText, getByRole } = render(<Signup />);
        
        // Using numbers for name
        fireEvent.change(getByLabelText(/first name/i), { target: { value: 'John123' } });
        fireEvent.change(getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: 'password123' } });

         // Submit the form
         const signUpButton = getByRole('button', { name: /sign up/i });
         fireEvent.click(signUpButton);
    
        await waitFor(() => {
            expect(getByText(/first name should contain only letters/i)).toBeInTheDocument();
        });
    });

    // Test if error shows when invalid email is used
    it('should show an error message for invalid email', async () => {
        const { getByLabelText, getByText, getByRole } = render(<Signup />);
        
        // Email is not correct
        fireEvent.change(getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText(/email/i), { target: { value: 'not-an-email' } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: 'password123' } });

         // Submit the form
        const signUpButton = getByRole('button', { name: /sign up/i });
        fireEvent.click(signUpButton);
    
        await waitFor(() => {
            expect(getByText(/please enter a valid email address/i)).toBeInTheDocument();
        });
    });

    // Test if error shows when invalid password is used
    it('should show an error message for invalid password', async () => {
        const { getByLabelText, getByText, getByRole } = render(<Signup />);
        
        // Password length needs to be >= 6
        fireEvent.change(getByLabelText(/first name/i), { target: { value: 'John' } });
        fireEvent.change(getByLabelText(/last name/i), { target: { value: 'Doe' } });
        fireEvent.change(getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: '123' } });

         // Submit the form
        const signUpButton = getByRole('button', { name: /sign up/i });
        fireEvent.click(signUpButton);
    
        await waitFor(() => {
            expect(getByText(/password should be at least 6 characters long/i)).toBeInTheDocument();
        });
    });

    // Test if error shows when there is no input
    it('should throw an error message for missing input', async () => {
        const { getByRole, getByText } = render(<Signup />);

        // Trying to signup without any forms filled in
        const signUpButton = getByRole('button', { name: /sign up/i });
        fireEvent.click(signUpButton);

        // Expected error popups
        await waitFor(() => {
            expect(getByText(/First name should contain only letters/i)).toBeInTheDocument();
            expect(getByText(/Last name should contain only letters/i)).toBeInTheDocument();
            expect(getByText(/please enter a valid email address/i)).toBeInTheDocument();
            expect(getByText(/password should be at least 6 characters long/i)).toBeInTheDocument();
        });
    });
});
