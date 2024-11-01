import React from "react";
import { Alert } from "react-bootstrap";

function MessageAlert({ variant, message, show, setShow }) {
  if (!show) return null;

  return (
    <Alert variant={variant} onClose={() => setShow(false)} dismissible>
      {message}
    </Alert>
  );
}

export default MessageAlert;
