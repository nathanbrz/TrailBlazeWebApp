"use client";
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import Modal from "../../components/Modal";
import TripForm from "./TripForm";

export default function IntroSection({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <section className="bg-white px-10 py-6">
      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        button={null}
        title={<h3 className="py-1">Trip Details</h3>}
        body={<TripForm />}
      />

      <Container>
        <Row>
          <Col>
            <div className="md:text-left">
              <span className="text-3xl text-gray-900 mb-4">Hi {user && user.first_name ? user.first_name : ''}, </span>
              <p className="text-lg text-gray-400 mb-6 inline px-2">
                here are your saved trips:
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mt-12 text-center">
              <button
                className="btn-blaze lg:w-1/4 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
                onClick={handleOpenModal}
              >
                Plan Your Next Trip!
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
