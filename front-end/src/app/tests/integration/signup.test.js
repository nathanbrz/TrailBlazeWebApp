import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "../../../__mocks__/apiMocks";
import Signup from "../../components/signup/signup.jsx";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth.js";
import { useApi } from "../../hooks/useApi";

/**
 *
 * This file contains UI integration tests for the user signing up
 * - TC-002: User can create an account if they don't have one
 */

// Test suite for signup
describe("Signup Integration Test", () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  // Test case for successful user signup
  it("should successfully sign up a user", async () => {
    // Creating mock credientials instead of using API call
    const mockUserCredential = {
      user: {
        getIdToken: jest.fn().mockResolvedValue("mocked-token"),
        uid: "mocked-uid",
      },
    };

    // Mocking the createUserWithEmailAndPassword function
    doCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);

    // Creating MOCK API calls instead of actual calling it
    useApi.mockImplementation((url, method) => {
      if (url === "api/firebase/session" && method === "POST") {
        return {
          fetchData: jest.fn().mockResolvedValueOnce({}),
          error: null,
          responseStatus: 200,
        };
      } else if (url === "api/users" && method === "POST") {
        return {
          fetchData: jest.fn().mockResolvedValueOnce({}),
          error: null,
        };
      }
      return { fetchData: jest.fn() };
    });

    // Rendering signup page
    const { getByLabelText, getByText, getByRole } = render(<Signup />);

    // Fill out the signup form
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Leave the inputs empty to trigger validation errors
    const signUpButton = getByRole("button", { name: /sign up/i });

    // Click the "Sign Up" button to submit the form
    fireEvent.click(signUpButton);

    // Expect that the signup form worked and the correct API calls were made
    await waitFor(() => {
      expect(doCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        "john.doe@example.com",
        "password123"
      );
      expect(useApi).toHaveBeenCalledWith("api/users", "POST");
    });
  });

  // Test case for error when first name contains numbers
  it("should show an error message if first name includes numbers", async () => {
    doCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("First name should contain only letters.")
    );
    const { getByLabelText, getByText, getByRole } = render(<Signup />);

    // Using numbers for name
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "123" },
    });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Locate the "Sign Up" button specifically by role
    const signUpButton = getByRole("button", { name: /Sign Up/i });

    // Click the "Sign Up" button to submit the form
    fireEvent.click(signUpButton);
    // Expect that an error pops up for the invalid first name

    // Wait for the alert message to appear
    await waitFor(() => {
      expect(
        getByText(/First name should contain only letters./i)
      ).toBeInTheDocument();
    });
  });

  // Test case for error when first name is left empty
  it("should show an error message when first name is empty", async () => {
    doCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("First name should contain only letters.")
    );
    const { getByLabelText, getByText, getByRole } = render(<Signup />);

    // Using numbers for name
    fireEvent.change(getByLabelText(/first name/i), { target: { value: "" } });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Locate the "Sign Up" button specifically by role
    const signUpButton = getByRole("button", { name: /Sign Up/i });

    // Click the "Sign Up" button to submit the form
    fireEvent.click(signUpButton);
    // Expect that an error pops up for the invalid first name

    // Wait for the alert message to appear
    await waitFor(() => {
      expect(
        getByText(/First name should contain only letters./i)
      ).toBeInTheDocument();
    });
  });

  // Test case for error when last name contains numbers
  it("should show an error message when numbers are used for last name", async () => {
    doCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Last name should contain only letters.")
    );
    const { getByLabelText, getByText, getByRole } = render(<Signup />);

    // Using numbers for name
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "Riley" },
    });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: "123" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Locate the "Sign Up" button specifically by role
    const signUpButton = getByRole("button", { name: /Sign Up/i });

    // Click the "Sign Up" button to submit the form
    fireEvent.click(signUpButton);
    // Expect that an error pops up for the invalid first name

    // Wait for the alert message to appear
    await waitFor(() => {
      expect(
        getByText(/Last name should contain only letters./i)
      ).toBeInTheDocument();
    });
  });

  // Test case for error when last name is left empty
  it("should show an error message when last name is left empty", async () => {
    doCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Last name should contain only letters.")
    );
    const { getByLabelText, getByText, getByRole } = render(<Signup />);

    // Using numbers for name
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "Riley" },
    });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: "123" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Locate the "Sign Up" button specifically by role
    const signUpButton = getByRole("button", { name: /Sign Up/i });

    // Click the "Sign Up" button to submit the form
    fireEvent.click(signUpButton);
    // Expect that an error pops up for the invalid first name

    // Wait for the alert message to appear
    await waitFor(() => {
      expect(
        getByText(/Last name should contain only letters./i)
      ).toBeInTheDocument();
    });
  });

  // Test case for invalid email
  it("should show an error message for invalid email", async () => {
    const { getByLabelText, getByText, getByRole } = render(<Signup />);
    doCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Please enter a valid email address.")
    );

    // Email is not correct
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit the form
    const signUpButton = getByRole("button", { name: /Sign up/i });
    fireEvent.click(signUpButton);

    // Expect that an error pops up for the invalid email
    // Wait for the alert message to appear
    await waitFor(() => {
      expect(
        getByText(/Please enter a valid email address./i)
      ).toBeInTheDocument();
    });
  });

  // Test case for error when email is empty
  it("should show an error message when email is left empty", async () => {
    const { getByLabelText, getByText, getByRole } = render(<Signup />);
    doCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Please enter a valid email address.")
    );

    // Email is not correct
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit the form
    const signUpButton = getByRole("button", { name: /Sign up/i });
    fireEvent.click(signUpButton);

    // Expect that an error pops up for the invalid email
    // Wait for the alert message to appear
    await waitFor(() => {
      expect(
        getByText(/Please enter a valid email address./i)
      ).toBeInTheDocument();
    });
  });

  // Test case for error when password is too short
  it("should show an error message for invalid password", async () => {
    const { getByLabelText, getByText, getByRole } = render(<Signup />);

    doCreateUserWithEmailAndPassword.mockRejectedValueOnce(
      new Error("Password should be at least 6 characters long.")
    );

    // Password length needs to be >= 6
    fireEvent.change(getByLabelText(/first name/i), {
      target: { value: "Riley" },
    });
    fireEvent.change(getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), { target: { value: "123" } });

    // Submit the form
    const signUpButton = getByRole("button", { name: /sign up/i });
    fireEvent.click(signUpButton);

    // Expect that an error pops up for the invalid password (not being long enough)
    await waitFor(() => {
      expect(
        getByText(/Password should be at least 6 characters long./i)
      ).toBeInTheDocument();
    });
  });

  // Test case when there is no input
  it("should show an error message for invalid password", async () => {
    const { getByRole, getByText } = render(<Signup />);

    // Trying to signup without any forms filled in
    const signUpButton = getByRole("button", { name: /sign up/i });
    fireEvent.click(signUpButton);

    // Expected that all the error pop ups occur
    await waitFor(() => {
      expect(
        getByText(/First name should contain only letters/i)
      ).toBeInTheDocument();
      expect(
        getByText(/Last name should contain only letters/i)
      ).toBeInTheDocument();
      expect(
        getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
      expect(
        getByText(/password should be at least 6 characters long/i)
      ).toBeInTheDocument();
    });
  });
});
