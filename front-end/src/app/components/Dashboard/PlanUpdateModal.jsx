import Modal from "../Modal";
import React, { useEffect, useState } from "react";
import PlanItemUpdateForm from "./PlanItemUpdateForm"; // Form component to confirm the deletion

// Functional component for handling the delete confirmation modal
export default function PlanUpdateModal({ show = false, hide, planID, onUpdateSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(show);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the deletion of a plan
  const handleUpdate = async (newName) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:4000/api/trips/${planID}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
			body: JSON.stringify({name: newName})
        });

        const result = await response.json();
        console.log("Update response:", result); // Log the response

        if (!response.ok) {
            throw new Error(result.error || "Failed to update");
        }

        onUpdateSuccess(); // Refresh the list in PlanListSection
        hide(); // Close modal
    } catch (err) {
        setError(err.message);
        console.error("Update error:", err.message); // Log the error
    } finally {
        setLoading(false);
    }
};

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    hide();
  };

  // Effect to synchronize the modal state with the `show` prop
  useEffect(() => {
    setIsModalOpen(show); // Update modal visibility when `show` prop changes
  }, [show]);

  return (
    <Modal
      show={isModalOpen}
      onClose={handleCloseModal}
      button={null}
      title={<h3 className="py-4">Submit a new name</h3>}
      body={<PlanItemUpdateForm onUpdate={handleUpdate} />}
    />
  );
}