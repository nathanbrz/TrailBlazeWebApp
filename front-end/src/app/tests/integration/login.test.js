import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '../../../__mocks__/apiMocks'; 
import Login from '../../components/login/login';
import { doSignInUserWithEmailAndPassword } from '../../firebase/auth';
import { useApi } from '../../hooks/useApi';
import { useRouter } from 'next/router';


// Test suite for signup
describe('Login Integration Test', () => {
    beforeEach(() => {
        // Reset the mocks before each test
        jest.clearAllMocks();
    });

    
    // Test if user can successfully login in with valid credientals
    it('should handle successful login and redirect to dashboard', async () => {
        
        // Render the component
        const { getByLabelText, getByText, getByRole } = render(<Login />);

        // Mock user data for input
        const email = 'user@email.com';
        const password = 'password123';

        // Fill in the form
        fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: password } });

        // Submit the form
        const signInButton = getByRole('button', { name: /login/i });
        fireEvent.click(signInButton);

        // Wait for async actions to complete
        await waitFor(async () => {

            // Expect that the sign function was correctly called with correct arguments
            expect(doSignInUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);

            // Assert that the token retrival was successful
            const userCredential = await doSignInUserWithEmailAndPassword(email, password)
            expect(userCredential.user.getIdToken).toHaveBeenCalled();
        });
    });



    // Test if it displays an alert for an invalid email
    it('should throw error message for an invalid email', async () => {

        // Getting form components
        const { getByLabelText, getByText, getByRole } = render(<Login />);

        // Mock user data for input
        const email = 'test.com';
        const password = 'password123';
     
        // Fill in the form
        fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: password } });
        
        // Submit the form
        const signInButton = getByRole('button', { name: /login/i });
        fireEvent.click(signInButton);

          
        // Expect that an error pops up for the invalid email
        await waitFor(() => {
            expect(getByText(/Please enter a valid email address./i)).toBeInTheDocument();
        });
    });



    // Test if it displays an alert for an invalid password (not long enough)
    it('should throw error message for an invalid email', async () => {

        // Getting form components
        const { getByLabelText, getByText, getByRole } = render(<Login />);

        // Mock user data for input
        const email = 'test@gmail.com';
        const password = 'pass';
     
        // Fill in the form
        fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: password } });
        
        // Submit the form
        const signInButton = getByRole('button', { name: /login/i });
        fireEvent.click(signInButton);

          
        // Expect that an error pops up for the invalid email
        await waitFor(() => {
            expect(getByText(/Password must be at least 6 characters long./i)).toBeInTheDocument();
        });
    })


    // Test if it displays error alert for invalid password
    it('should display an alert for invalid password', async () => {

        // Return an error if wrong password or email
        doSignInUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Incorrect password. Please try again."));

        // Getting form components
        const { getByLabelText, getByText, getByRole } = render(<Login />);

        // Mock user data for input
        const email = 'wrong@gmail.com';
        const password = 'badPassword';
     
        // Fill in the form
        fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: password } });
        
        // Submit the form
        const signInButton = getByRole('button', { name: /login/i });
        fireEvent.click(signInButton);

          
         // Wait for async actions to complete
        await waitFor(async () => {
            expect(getByRole('alert')).toBeInTheDocument();
            expect(getByText(/Incorrect password. Please try again./i)).toBeInTheDocument();
        });
    })

    // Test if it displays error alert for invalid email
    it('should display an alert for invalid password', async () => {

        // Return an error if wrong password or email
        doSignInUserWithEmailAndPassword.mockRejectedValueOnce(new Error("No user found with this email."));

        // Getting form components
        const { getByLabelText, getByText, getByRole } = render(<Login />);

        // Mock user data for input
        const email = 'wrong@gmail.com';
        const password = 'badPassword';
     
        // Fill in the form
        fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
        fireEvent.change(getByLabelText(/password/i), { target: { value: password } });
        
        // Submit the form
        const signInButton = getByRole('button', { name: /login/i });
        fireEvent.click(signInButton);

          
         // Wait for async actions to complete
        await waitFor(async () => {
            expect(getByRole('alert')).toBeInTheDocument();
            expect(getByText(/No user found with this email./i)).toBeInTheDocument();
        });
    })
});


