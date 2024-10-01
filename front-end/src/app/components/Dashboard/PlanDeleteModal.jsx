import Modal from "../Modal";
import React, { useEffect, useState } from "react";
import PlanItemDeleteForm from "./PlanItemDeleteForm";

export default function PlanDeleteModal({ show = false, hide, planID }) {
  const [isModalOpen, setIsModalOpen] = useState(show);

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
      title={
        <h3 className="py-4">Are you sure you want to delete this plan?</h3>
      }
      body={<PlanItemDeleteForm />}
    />
  );
}
