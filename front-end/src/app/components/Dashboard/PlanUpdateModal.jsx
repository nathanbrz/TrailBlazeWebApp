import Modal from "../Modal";
import React, { useEffect, useState } from "react";
import PlanItemUpdateForm from "./PlanItemUpdateForm"; // Form component to confirm the deletion
import { useApi } from "@/app/hooks/useApi";

// Functional component for handling the delete confirmation modal
export default function PlanUpdateModal({
  show = false,
  hide,
  planID,
  onUpdateSuccess,
}) {
  const [isModalOpen, setIsModalOpen] = useState(show);

  // Setup useApi for the PUT request
  const { data, loading, error, fetchData } = useApi(
    `api/trips/${planID}`,
    "PUT"
  );

  // Function to handle the update of a plan
  const handleUpdate = async (newName) => {
    try {
      await fetchData({ body: { name: newName } }); // Call fetchData with new name
    } catch (err) {
      console.error("Update error:", error); // Log the error
    }
  };

  // Effect to trigger onUpdateSuccess when update completes
  useEffect(() => {
    if (!loading && data) {
      onUpdateSuccess(); // Refresh the list in PlanListSection
      hide();
    }
  }, [loading, data, onUpdateSuccess, hide]);

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
