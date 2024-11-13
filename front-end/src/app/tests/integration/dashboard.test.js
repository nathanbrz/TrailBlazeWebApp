import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  getByLabelText,
  getByText,
  findByPlaceholderText,
} from "@testing-library/react";
import "../../../__mocks__/apiMocks";
import Login from "../../components/login/login";
import { doSignInUserWithEmailAndPassword } from "../../firebase/auth";
import { useApi } from "../../hooks/useApi";
import { useRouter } from "next/router";
import { onIdTokenChanged } from "firebase/auth";
import PlanItem from "../../components/Dashboard/PlanItem";
import IntroSection from "../../components/Dashboard/IntroSection";
import TripForm from "@/app/components/Dashboard/TripForm";
import SearchForm from "@/app/components/Dashboard/SearchForm";
import PlanListSection from "@/app/components/Dashboard/PlanListSection";

/**
 *
 * This file contains UI integration tests for the the user interacting with the dashboard
 * Includes:
 * TC-004: Verify users can specify start location, destination, trip length and preferences
 * TC-009: Verify system prompts confirmation from user before deleting a trip plan
 * TC-010: Ensure users can search through trip plans they have saved
 * TC-011: Ensure users can click on trip plans to view details
 * Creating a new trip
 * Modifying an existing trip
 * Deleting an existing trip
 */

describe("PlanItem", () => {
  // Runs before each of the tests
  beforeEach(() => {});

  // Test to make sure the
  test("renders the PlanItem correctly", () => {
    const { getByLabelText, getByText, getByRole, getAllByText } = render(
      <PlanItem
        id="1"
        type="Adventure"
        title="Trip to the Mountains"
        name="Mountain Adventure"
        description="A thrilling trip"
        duration={5}
        travel_time="2 hours"
        notes="Bring warm clothes"
        itinerary={{
          destination: "Mountains",
          activities: ["hiking", "sightseeing"],
        }}
        isClickable={true}
      />
    );

    expect(getAllByText("A thrilling trip")[0]).toBeInTheDocument();
    expect(getByText("Duration (days): 5")).toBeInTheDocument();
    expect(getByText("Travel Time: 2 hours")).toBeInTheDocument();
    expect(getByText("Bring warm clothes")).toBeInTheDocument();
  });

  // Verifies the trip form shows up when a user requests it
  test("Options appear for trip planning page", async () => {
    // Mocking a fake user
    const user = { first_name: "John" };

    // Rending the intro dashboard page
    const { getByRole, findByTestId, getByLabelText, getByPlaceholderText } =
      render(<IntroSection user={user} />);

    // Verify that the Plan Your next Trip button appears
    const planButton = getByRole("button", {
      name: /Plan Your Next Trip/i,
    });
    expect(planButton).toBeInTheDocument();

    // Clicking on plan next trip button
    fireEvent.click(planButton);

    // Check if TripForm is rendered with options for user
    const nameField = getByPlaceholderText(/New Trip/i); // Check for 'Name' input field
    expect(nameField).toBeInTheDocument();
  });

  // TC-004: Verify users can specify start location, destination, trip length and preferences
  test("renders form fields correctly", () => {
    render(<TripForm />);

    // Check for the form controls using their controlId
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByText("Start City")).toBeInTheDocument();
    expect(screen.getByText("End City")).toBeInTheDocument();
    expect(screen.getByLabelText(/Ideal Trip Duration/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/What are you looking for in this trip?/)
    ).toBeInTheDocument();
  });

  // Test to make sure the update form loads
  test("allows user to click on the update button for a trip", async () => {
    // Render planned items
    const { getByLabelText, getByText, getByRole, getAllByText } = render(
      <PlanItem
        id="1"
        type="Adventure"
        title="Trip to the Mountains"
        name="Mountain Adventure"
        description="A thrilling trip"
        duration={5}
        travel_time="2 hours"
        notes="Bring warm clothes"
        itinerary={{
          destination: "Mountains",
          activities: ["hiking", "sightseeing"],
        }}
        isClickable={true}
      />
    );
    // Mocking onUpdate function
    const mockOnUpdate = jest.fn();

    // Find the update button
    const updateButton = getByRole("button", {
      name: /Update/i,
    });

    // Ensure the update button is present
    expect(updateButton).toBeInTheDocument();

    // Simulate clicking the "Update" button to show the PlanItemUpdateForm
    fireEvent.click(updateButton);

    // Expect the PlanUpdateModal is now in the document
    const updateModal = getByText(/Update Modal/i);
    expect(updateModal).toBeInTheDocument();
  });

  // TC-009: Verify system prompts confirmation from user before deleting a trip plan
  test("it should display confirmation before deleting a trip plan", async () => {
    const mockOnUpdate = jest.fn();

    // Render planned items
    const { getByLabelText, getByText, getByRole, getAllByText } = render(
      <PlanItem
        id="1"
        type="Adventure"
        title="Trip to the Mountains"
        name="Mountain Adventure"
        description="A thrilling trip"
        duration={5}
        travel_time="2 hours"
        notes="Bring warm clothes"
        itinerary={{
          destination: "Mountains",
          activities: ["hiking", "sightseeing"],
        }}
        isClickable={true}
      />
    );

    // Find the delete button
    const deleteButton = getByRole("button", {
      name: /Delete/i,
    });

    // Ensure the delete button is present
    expect(deleteButton).toBeInTheDocument();

    // Simulate clicking the "delete" button to show the PlanItemUpdateForm
    fireEvent.click(deleteButton);

    // Expect the PlanDeleteModal is now in the document
    const deleteModal = getByText(/Delete Modal/i);
    expect(deleteModal).toBeInTheDocument();

    // Expect a confirmation prompt before deleting
    expect(
      screen.getByText("Are you sure you want to delete this plan?")
    ).toBeInTheDocument();
  });

  // TC-010: Ensure users can search through trip plans they have saved
  test("allows user to search for iteneray plans", async () => {
    // Mocking onSearch function
    const mockOnSearch = jest.fn();

    // Rendering the search form
    render(<SearchForm onSearch={mockOnSearch} />);

    // Finding the search bar
    const searchInput = screen.getByPlaceholderText(/Type to search/i);
    const searchButton = screen.getByRole("button");

    // Typing into the search bar
    fireEvent.change(searchInput, { target: { value: "Hawaii" } });

    // Simulate clicking the search button
    fireEvent.click(searchButton);

    // Assert that the onSearch function was called with the correct argument
    expect(mockOnSearch).toHaveBeenCalledWith("Hawaii");
  });

  // TC-011: Ensure users can click on trip plans to view details
  test("allows the user to click on a trip plan to view its details", async () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });

    const mockTrips = [
      {
        _id: "1",
        name: "Trip to Paris",
        start_location: "Paris",
        end_location: "London",
        trip_interest: "Adventure",
        total_duration: 7,
        itinerary: [{ day: 1, activity: "Visit Eiffel Tower" }],
      },
    ];

    useApi.mockReturnValue({
      data: mockTrips,
      loading: false,
      error: null,
      fetchData: jest.fn(),
    });

    render(<PlanListSection router={{ push }} query="" />);

    // Simulate clicking the "Trip to Paris"
    fireEvent.click(screen.getByText("Trip to Paris"));

    // Ensure the router.push method was called with the correct path
    expect(push).toHaveBeenCalled();
  });
});
