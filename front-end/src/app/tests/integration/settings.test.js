import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "../../../__mocks__/apiMocks";
import { useApi } from "../../hooks/useApi";
import { PureUserSettings as UserSettings } from "../../settings/[userId]/page.jsx";
import {
  doUpdateName,
  doPasswordChange,
  doEmailChange,
  doUpdateEmail,
  doDeleteUser,
} from "@/app/firebase/auth";

/**
 *
 * This file contains integration tests for User Settings, including
 * - TC-008: User must be able to delete account
 * - TC-020: User must be able to change their name
 * - TC-021: User must be able to change their password
 * - TC-022: User must be able to change their email
 *
 * The tests verify the correct rendering of initial user data, validation of input fields,
 * and success/failure of form submissions based on valid and invalid data.
 */

// Test suite for UserSettings component
describe("User Settings Test", () => {
  beforeEach(() => {
    // Mocking API response for the user data
    useApi.mockReturnValue({
      data: {
        user: {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
        },
      },
      error: null,
    });

    // Mocking localStorage to simulate a valid user session
    global.localStorage = {
      getItem: jest.fn().mockReturnValue("some-uuid"), // Return a mock UUID to prevent redirect
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    // Mocking the Next.js router push to prevent actual redirection
    jest.spyOn(require("next/router"), "useRouter").mockReturnValue({
      push: jest.fn(),
    });
  });

  afterEach(() => {
    // Clear mocks after each test to prevent state leakage
    jest.clearAllMocks();
  });

  // Test to ensure UserSettings renders with initial user data
  test("renders UserSettings with correct initial data", () => {
    const { getByLabelText } = render(<UserSettings />);

    // Verifying that initial values are rendered correctly
    expect(getByLabelText(/first name/i).value).toBe("John");
    expect(getByLabelText(/last name/i).value).toBe("Doe");
    expect(getByLabelText(/email/i).value).toBe("john.doe@example.com");
  });

  // Test for displaying an error when trying to save invalid name
  test("should display alert on invalid name change", async () => {
    const { getByLabelText, getByText, getByRole } = render(<UserSettings />);

    // Changing first and last name to empty values
    fireEvent.change(getByLabelText(/First Name/i), {
      target: { value: "" },
    });
    fireEvent.change(getByLabelText(/Last Name/i), {
      target: { value: "" },
    });

    // Clicking the save button
    const saveButton = getByRole("button", { name: /Save Name/i });
    fireEvent.click(saveButton);

    // Waiting for the error message to appear
    await waitFor(() => {
      expect(
        getByText(/First name must be at least 2 characters./i)
      ).toBeInTheDocument();
    });
  });

  // Test for successfully updating the name with valid input
  test("should update name on valid form submission", async () => {
    const { getByLabelText, getByText, getByRole } = render(<UserSettings />);

    // Changing the name to valid inputs
    fireEvent.change(getByLabelText(/First Name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(getByLabelText(/Last Name/i), {
      target: { value: "Smith" },
    });

    // Submitting the form
    const saveButton = getByRole("button", { name: /Save Name/i });
    fireEvent.click(saveButton);

    // Verifying that the name has been updated
    await waitFor(() => {
      expect(getByLabelText(/First Name/i).value).toBe("Jane");
      expect(getByLabelText(/Last Name/i).value).toBe("Smith");
    });
  });

  // Test for displaying an error when password is too short
  test("should show alert on invalid password change", async () => {
    const { getByLabelText, getByText, getByRole } = render(<UserSettings />);

    // Changing to an invalid password
    fireEvent.change(getByLabelText(/New Password/i), {
      target: { value: "123" },
    });

    // Submitting the form
    const saveButton = getByRole("button", { name: /Save Password/i });
    fireEvent.click(saveButton);

    // Verifying that the error message is displayed
    await waitFor(() => {
      expect(
        getByText(/Password must be at least 6 characters./i)
      ).toBeInTheDocument();
    });
  });

  // Test for successfully updating password with valid input
  test("should update password on valid form submission", async () => {
    const { getByLabelText, getByText, getByRole } = render(<UserSettings />);

    // Mocking the password change function to simulate success
    doPasswordChange.mockResolvedValueOnce();

    // Changing to a valid password
    fireEvent.change(getByLabelText(/New Password/i), {
      target: { value: "newpassword123" },
    });

    // Clicking save button
    const saveButton = getByRole("button", { name: /Save Password/i });
    fireEvent.click(saveButton);

    // Verifying that the success message is displayed
    await waitFor(() => {
      expect(getByText(/Password change successful./i)).toBeInTheDocument();
    });
  });

  // Test for showing an error when email is invalid
  test("should show alert on invalid email change", async () => {
    const { getByLabelText, getByText, getByRole } = render(<UserSettings />);

    // Changing to an invalid email
    fireEvent.change(getByLabelText(/Email/i), {
      target: { value: "invalidemail" },
    });

    // Submitting the form
    const saveButton = getByRole("button", { name: /Save Email/i });
    fireEvent.click(saveButton);

    // Verifying that the error message is displayed
    await waitFor(() => {
      expect(
        getByText(/Please enter a valid email address./i)
      ).toBeInTheDocument();
    });
  });

  // Test for successfully updating the email with valid input
  test("should update email on valid form submission", async () => {
    const { getByLabelText, getByText, getByRole } = render(<UserSettings />);

    // Mocking email change API call
    const mockUpdateEmail = jest.fn();
    useApi.mockReturnValue({
      loading: false,
      error: null,
      fetchData: mockUpdateEmail,
    });

    doUpdateEmail.mockResolvedValueOnce("Email updated successfully");

    // Changing the email to a valid address
    fireEvent.change(getByLabelText(/Email/i), {
      target: { value: "jane.smith@example.com" },
    });

    // Submitting the form
    const saveButton = getByRole("button", { name: /Save Email/i });
    fireEvent.click(saveButton);

    // Verifying that the success message is displayed
    await waitFor(() => {
      expect(getByText(/Email change successful./i)).toBeInTheDocument();
    });
  });

  // Test for successful account deletion
  test("should delete account successfully", async () => {
    // Mock logout function
    const mockHandleLogout = jest.fn();

    // Rendering UserSettings with mock logout function
    const { getByRole, getByText } = render(
      <UserSettings handleLogout={mockHandleLogout} />
    );

    // Mocking account deletion success
    doDeleteUser.mockResolvedValueOnce();

    // Clicking the delete button
    const deleteButton = getByRole("button", { name: /Delete Account/i });
    fireEvent.click(deleteButton);

    // Verifying the success message after deletion
    await waitFor(() => {
      expect(getByText(/Goodbye!/i)).toBeInTheDocument();
    });
  });
});
