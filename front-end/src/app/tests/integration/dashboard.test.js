import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "../../../__mocks__/apiMocks";
import Login from "../../components/login/login";
import { doSignInUserWithEmailAndPassword } from "../../firebase/auth";
import { useApi } from "../../hooks/useApi";
import { useRouter } from "next/router";
import { onIdTokenChanged } from "firebase/auth";
import PlanItem from "../../components/Dashboard/PlanItem";

// Test if the Plan can be deleted

describe("PlanItem", () => {
  // Runs before each of the tests
  beforeEach(() => {
    render(
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
  });

  test("renders the PlanItem correctly", () => {
    const { getByLabelText, getByText, getByRole, getAllByText } = render(
      <PlanItem />
    );
    expect(getAllByText("A thrilling trip")[0]).toBeInTheDocument();
    expect(getByText("Duration (days): 5")).toBeInTheDocument();
    expect(getByText("Travel Time: 2 hours")).toBeInTheDocument();
    expect(getByText("Bring warm clothes")).toBeInTheDocument();
  });
});
