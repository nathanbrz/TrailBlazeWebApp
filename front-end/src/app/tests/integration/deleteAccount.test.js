import React from "react"; // Add this import
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PureUserSettings } from "@/app/settings/[userId]/page";
import { useRouter } from "next/navigation";
import * as auth from "@/app/firebase/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/firebase/auth", () => ({
  doDeleteUser: jest.fn(),
  doSignOut: jest.fn(),
}));

describe("UserSettings - Delete Account", () => {
  let mockRouterPush;

  beforeEach(() => {
    mockRouterPush = jest.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete account and display goodbye message", async () => {
    auth.doDeleteUser.mockResolvedValueOnce();
    auth.doSignOut.mockResolvedValueOnce();

    render(<PureUserSettings />);

    const deleteButton = screen.getByText("Delete Account");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(auth.doDeleteUser).toHaveBeenCalled();
      expect(auth.doSignOut).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/login");
      const goodbyeMessage = screen.queryByText("Goodbye!");
      expect(goodbyeMessage).not.toBeNull();
    });
  });

  it("should display error message if deletion fails", async () => {
    auth.doDeleteUser.mockRejectedValueOnce(new Error("Deletion failed"));

    render(<PureUserSettings />);

    const deleteButton = screen.getByText("Delete Account");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(auth.doDeleteUser).toHaveBeenCalled();
      const errorMessage = screen.queryByText("Deletion failed");
      expect(errorMessage).not.toBeNull();
    });
  });
});
