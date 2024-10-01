import React from "react";
import { Form } from "react-bootstrap";

function PlanItemDeleteForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submit logic here
    console.log("Delete action triggered");
  };

  return (
    <Form onSubmit={handleSubmit} className="mx-4">
      <button
        className="btn-blaze w-100 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
        type="submit"
      >
        Delete
      </button>
    </Form>
  );
}

export default PlanItemDeleteForm;
