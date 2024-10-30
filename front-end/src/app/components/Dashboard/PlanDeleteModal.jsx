import Modal from "../Modal";
import React, { useEffect, useState } from "react";
import PlanItemDeleteForm from "./PlanItemDeleteForm";

export default function PlanDeleteModal({ show = false, hide, planID, onDeleteSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(show);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    hide();
  };

  useEffect(() => {
    setIsModalOpen(show);
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