'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use this for Next.js app directory
import { useUser } from '../../context/UserContext'; // Adjust the path if needed
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter(); // Use router from next/navigation
  const { setUser } = useUser(); // Access the context

  // Clear token on initial render
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validation
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      if (!email) emailInputRef.current?.focus();
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();


      if (response.ok && data.token) {
        setSuccessMessage(data.message);

        // Store user data (name, email, token) in localStorage
        localStorage.setItem('user', JSON.stringify({
          name: data.name,
          email: data.email,
          token: data.token,
        }));

        // Update user state in the context with more details
        setUser({
          name: data.name,
          email: data.email,
          token: data.token,
        });

        // Redirect after a short delay
        setTimeout(() => {
          setIsSubmitting(false);
          router.push('/'); // Redirect to home page or dashboard
        }, 1500);
      } else {
        setErrorMessage(data.message || 'Invalid login credentials');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Login error:', error); // Debugging network or code errors
      setErrorMessage('An error occurred. Please try again later.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
      <div
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 ease-in-out hover:scale-105"
        style={{ maxWidth: '400px', minWidth: '350px' }}
      >
        <h1 className="text-3xl font-semibold text-center text-red-600 mb-6 tracking-wide">
          Login
        </h1>

        {successMessage && (
          <div className="text-green-600 mb-4 text-center">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-red-600 mb-4 text-center">{errorMessage}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition duration-200"
              placeholder="Enter your email"
              required
            />
            <FaEnvelope className="absolute right-4 top-4 text-black" />
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition duration-200"
              placeholder="Enter your password"
              required
            />
            <FaLock className="absolute right-4 top-4 text-black" />
          </div>

          <button
            type="submit"
            className={`w-full py-3 bg-red-600 text-white font-semibold rounded-md transition duration-200 transform hover:bg-red-700 focus:ring-4 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black">
          Don't have an account?{' '}
          <a href="/register" className="text-red-600 hover:underline font-medium">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
