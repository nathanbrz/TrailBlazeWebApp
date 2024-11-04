import Modal from "../Modal";
import React, { useEffect, useState } from "react";
import PlanItemDeleteForm from "./PlanItemDeleteForm"; // Form component to confirm the deletion

// Functional component for handling the delete confirmation modal
export default function PlanUpdateModal({ show = false, hide, planID, onDeleteSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(show);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the deletion of a plan
  const handleDelete = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:4000/api/trips/${planID}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        console.log("Delete response:", result); // Log the response

        if (!response.ok) {
            throw new Error(result.error || "Failed to delete");
        }

        onDeleteSuccess(); // Refresh the list in PlanListSection
        hide(); // Close modal
    } catch (err) {
        setError(err.message);
        console.error("Delete error:", err.message); // Log the error
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
      title={<h3 className="py-4">Are you sure you want to delete this plan?</h3>}
      body={<PlanItemDeleteForm onDelete={handleDelete} />}
    />
  );
}