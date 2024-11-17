import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "../../../__mocks__/apiMocks";
import Login from "../../components/login/login";
import IntroSection from "../../components/Dashboard/IntroSection";
import SearchBar from "../../components/Dashboard/SearchBar";
import { doSignInUserWithEmailAndPassword } from "../../firebase/auth";
import { useApi } from "../../hooks/useApi";
import { useRouter } from "next/router";
import { onIdTokenChanged } from "firebase/auth";

/**
 *
 * This file contains UI integration tests for the user logging in
 * - TC-001: User can sign into existing account
 */

// Test suite for signup
describe("Login Integration Test", () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  // Test if user can successfully login with valid credentials
  it("should handle successful login and redirect to dashboard", async () => {
    // Render the component
    const { getByLabelText, getByText, getByRole } = render(<Login />);

    // Mock user data for input
    const email = "user@email.com";
    const password = "password123";

    // Fill in the form
    fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: password },
    });

    // Submit the form
    const signInButton = getByRole("button", { name: /login/i });
    fireEvent.click(signInButton);

    // Wait for async actions to complete
    await waitFor(async () => {
      // Expect that the sign function was correctly called with correct arguments
      expect(doSignInUserWithEmailAndPassword).toHaveBeenCalledWith(
        email,
        password
      );

      // Assert that the token retrival was successful
      const userCredential = await doSignInUserWithEmailAndPassword(
        email,
        password
      );
      expect(userCredential.user.getIdToken).toHaveBeenCalled();
    });
  });

  // Test if it displays an alert for an invalid email
  it("should throw error message for an invalid email", async () => {
    // Getting form components
    const { getByLabelText, getByText, getByRole } = render(<Login />);

    // Mock user data for input
    const email = "test.com";
    const password = "password123";

    // Fill in the form
    fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: password },
    });

    // Submit the form
    const signInButton = getByRole("button", { name: /login/i });
    fireEvent.click(signInButton);

    // Expect that an error pops up for the invalid email
    await waitFor(() => {
      expect(
        getByText(/Please enter a valid email address./i)
      ).toBeInTheDocument();
    });
  });

  // Test if it displays an alert for an invalid password (too short)
  it("should throw error message for an invalid email", async () => {
    // Getting form components
    const { getByLabelText, getByText, getByRole } = render(<Login />);

    // Mock user data for input
    const email = "test@gmail.com";
    const password = "pass";

    // Fill in the form
    fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: password },
    });

    // Submit the form
    const signInButton = getByRole("button", { name: /login/i });
    fireEvent.click(signInButton);

    // Expect that an error pops up for the invalid email
    await waitFor(() => {
      expect(
        getByText(/Password must be at least 6 characters long./i)
      ).toBeInTheDocument();
    });
  });

  // Test if it displays error alert for incorrect password
  it("should display an alert for invalid password", async () => {
    // Return an error if wrong password or email
    doSignInUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Incorrect password. Please try again.")
    );

    // Getting form components
    const { getByLabelText, getByText, getByRole } = render(<Login />);

    // Mock user data for input
    const email = "wrong@gmail.com";
    const password = "badPassword";

    // Fill in the form
    fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: password },
    });

    // Submit the form
    const signInButton = getByRole("button", { name: /login/i });
    fireEvent.click(signInButton);

    // Wait for async actions to complete
    await waitFor(async () => {
      expect(getByRole("alert")).toBeInTheDocument();
      expect(
        getByText(/Incorrect password. Please try again./i)
      ).toBeInTheDocument();
    });
  });

  // Test if it displays error alert for non-existent email
  it("should display an alert for invalid password", async () => {
    // Return an error if wrong password or email
    doSignInUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("No user found with this email.")
    );

    // Getting form components
    const { getByLabelText, getByText, getByRole } = render(<Login />);

    // Mock user data for input
    const email = "wrong@gmail.com";
    const password = "badPassword";

    // Fill in the form
    fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: password },
    });

    // Submit the form
    const signInButton = getByRole("button", { name: /login/i });
    fireEvent.click(signInButton);

    // Wait for async actions to complete
    await waitFor(async () => {
      expect(getByRole("alert")).toBeInTheDocument();
      expect(getByText(/No user found with this email./i)).toBeInTheDocument();
    });
  });

  // Test if the system keeps users logged in while active and allows manual logout
  it("should keep the user logged in while active and allow manual logout", async () => {
    // Render the components
    const { getByLabelText, queryByText, getByRole, getByTestId } = render(
      <>
        <Login />
        <IntroSection />
        <SearchBar />
      </>
    );

    // Mock user data for input
    const email = "user@email.com";
    const password = "password123";

    // Fill in the form
    fireEvent.change(getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: password },
    });

    // Submit the form
    const signInButton = getByRole("button", { name: /login/i });
    fireEvent.click(signInButton);

    // Wait for the login process to complete
    await waitFor(async () => {
      // Ensure the login function is called with correct arguments
      expect(doSignInUserWithEmailAndPassword).toHaveBeenCalledWith(
        email,
        password
      );

      // Verify the token retrieval was called
      const userCredential = await doSignInUserWithEmailAndPassword(
        email,
        password
      );
      expect(userCredential.user.getIdToken).toHaveBeenCalled();
    });

    // Check if "Hi" is visible in the IntroSection
    await waitFor(async () => {
      expect(queryByText(/Hi/i)).toBeVisible(); // Check visibility of "Hi" in IntroSection
    });

    // Simulate clicking the "Log Out" button in the dropdown menu

    // Open the dropdown by clicking on the menu button
    const dropdownToggle = getByTestId("dropdown");
    fireEvent.click(dropdownToggle);

    // Find the "Log Out" button within the dropdown
    const logoutButton = getByTestId("logout");

    // Click the "Log Out" button
    fireEvent.click(logoutButton);

    // Wait for the logout process to complete
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("uuid")).toBeNull();
      expect(getByRole("button", { name: /login/i })).toBeVisible();
    });
  });
});
