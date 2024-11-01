"use client";
import React, { useState } from "react";
import GenericNav from "../../components/GenericNav";
import Footer from "../../components/Footer";

export default function UserSettings() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion logic goes here");
  };

  return (
    <>
      <GenericNav/>
      <div className="container mx-auto mt-10 p-5">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          User Settings
        </h2>

        {/* Name Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Change Name
          </h3>
          <div className="form-group">
            <label
              htmlFor="name"
              className="block text-gray-600 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <button
            type="button"
            className="mt-4 btn-blaze hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            Save Name
          </button>
        </div>

        {/* Password Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Change Password
          </h3>
          <div className="form-group">
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button
            type="button"
            className="mt-4 btn-blaze hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            Save Password
          </button>
        </div>

        {/* Email Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Change Email
          </h3>
          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <button
            type="button"
            className="mt-4 btn-blaze hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            Save Email
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="bg-red-100 shadow-lg rounded-lg p-8">
          <div className="p-8">
            <h3 className="text-xl font-semibold text-red-700 mb-4">
              Danger Zone
            </h3>
            <p className="text-gray-700 mb-4">
              Permanently delete your account. This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
