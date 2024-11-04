import React, { useState } from "react";
import { Form } from "react-bootstrap";

function PlanItemUpdateForm({ onUpdate }) {

	const [newName, setNewName] = useState("")
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(newName); // Trigger the update action
  };

  return (
    <Form onSubmit={handleSubmit} className="mx-4">
		<Form.Group className="mb-3" controlId="update">
			<Form.Label>New Name</Form.Label>
			<Form.Control
				type="string"
				name="name"
				placeholder="my trip"
				value={newName}
				onChange={(e) => setNewName(e.target.value)}
				/>
		</Form.Group>
		<button
			className="btn-blaze w-100 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
			type="submit"
		>
			Update
		</button>
    </Form>
  );
}

export default PlanItemUpdateForm;