"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext"; // Adjust path
import Link from "next/link";

const LoginBtn = () => {
  const { user, setUser } = useUser(); // Access context state
  const [showLogout, setShowLogout] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // Ensures rendering occurs only after hydration
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API if needed
      await fetch("/api/auth/logout", { method: "POST" });

      // Remove user data from localStorage
      localStorage.removeItem("user");
      setUser(null); // Clear user state
      setShowLogout(false); // Hide logout option

      // Redirect to login page if window object is available
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!hydrated) return null; // Prevent rendering until hydration is complete

  return (
    <>
      {user ? (
        <>
          {/* Circle button (User's initial) */}
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="text-xl font-semibold text-white bg-red-600 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ease-out transform hover:scale-110 focus:outline-none"
          >
            {/* Display first letter of the user's name */}
            {user?.name?.charAt(0).toUpperCase()}
          </button>

          {/* Logout button */}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 border-2 border-red-600 text-red-600 bg-white rounded-lg shadow-xl transition duration-300 ease-in-out transform hover:bg-red-600 hover:text-white hover:scale-105 focus:outline-none"
            >
              Logout
            </button>
          )}
        </>
      ) : (
        <Link href="/login">
          {/* Login button */}
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-xl transition-all duration-300 ease-out transform hover:bg-red-700 hover:scale-105 focus:outline-none">
            Login
          </button>
        </Link>
      )}
    </>
  );
};

export default LoginBtn;
