import React from "react";
import { Modal as Md } from "react-bootstrap";

function Modal({ show = false, onClose = () => {}, title, body, button }) {
  return (
    <Md
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      className="modal"
    >
      <Md.Header closeButton className="border-0">
        <Md.Title className="w-100 text-center">{title}</Md.Title>
      </Md.Header>
      <Md.Body className="px-12">{body}</Md.Body>
      <Md.Footer className="px-12 border-0">{button}</Md.Footer>
    </Md>
  );
}

export default Modal;
