import Modal from "../Modal";
import React, { useEffect, useState } from "react";
import PlanItemDeleteForm from "./PlanItemDeleteForm"; // Form component to confirm the deletion
import { useApi } from "@/app/hooks/useApi";

// Functional component for handling the delete confirmation modal
export default function PlanDeleteModal({
  show = false,
  hide,
  planID,
  onDeleteSuccess,
}) {
  const [isModalOpen, setIsModalOpen] = useState(show);

  // Setup useApi for the DELETE request
  const { data, loading, error, fetchData } = useApi(
    `api/trips/${planID}`,
    "DELETE"
  );

  // Function to handle the deletion of a plan
  const handleDelete = async () => {
    try {
      await fetchData(); // Call fetchData to initiate DELETE request
      if (data) {
        console.log("Delete response:", data); // Log the response
        onDeleteSuccess(); // Refresh the list in PlanListSection
        hide(); // Close modal
      }
    } catch (err) {
      console.error("Delete error:", error); // Log the error
    }
  };

  // Effect to handle page refresh after delete completes
  useEffect(() => {
    if (!loading && data) {
      onDeleteSuccess(); // Refresh the list in PlanListSection
      hide(); // Close modal
    }
  }, [loading, data, onDeleteSuccess, hide]);

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
      title={
        <h3 className="py-4">Are you sure you want to delete this plan?</h3>
      }
      body={
        <>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          <PlanItemDeleteForm onDelete={handleDelete} />
        </>
      }
    />
  );
}
