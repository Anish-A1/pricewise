'use client';  // Ensure this is a client component

import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'; // Import icons
import { useRouter } from "next/navigation"; // For navigation after successful registration

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter(); // To navigate after successful registration

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Success: Show success message
        setSuccessMessage(data.message);
        setErrorMessage("");  // Clear any previous error messages
        router.push("/login");  // Redirect to login page after registration
      } else {
        // Error: Show error message
        setErrorMessage(data.message);
        setSuccessMessage(""); // Clear any previous success messages
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      setSuccessMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 ease-in-out hover:scale-105" style={{ maxWidth: '400px', minWidth: '350px' }}>
        <h1 className="text-3xl font-semibold text-center text-red-600 mb-6 tracking-wide transform transition-all hover:scale-105">
          Register
        </h1>

        {/* Show success or error messages */}
        {successMessage && (
          <div className="text-green-600 mb-4 text-center">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-red-600 mb-4 text-center">{errorMessage}</div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 pr-12 pl-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition duration-200"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pr-12 pl-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 pl-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-md transition duration-200 transform hover:bg-red-700 focus:ring-4 focus:ring-red-500"
          >
            Register
          </button>
        </form>

        {/* Redirect to Login if already have an account */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-red-600 hover:underline font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
