import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from 'lucide-react'; // Icon from Lucide
import { register } from "../../services/api"; // Import the register function from the API service

// Used in App.jsx
export default function Register({ setActiveTab }) {
  const [email, setEmail] = useState(''); // State to manage email input
  const [password, setPassword] = useState(''); // State to manage password input
  const [error, setError] = useState(''); // State to manage error messages
  const navigate = useNavigate();

  // Set the active tab to "register" when the component is rendered
  useEffect(() => {
    setActiveTab('register');
  }, [setActiveTab]);

  // This function is called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default page refresh
    setError('');

    // Call the register function from the API service
    // If the registration is successful, navigate to the login page
    try {
      const response = await register(email, password);
      if (response.ok) {
        setActiveTab('login')
        navigate('/login');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        {/* Logo and title in register page*/}
        <div className="flex items-center justify-center mb-6">
          <Layout className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-semibold text-gray-900">FL-ALL Dashboard</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Register</h2>

        {/* Display error message if any */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-100 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-100 text-gray-900"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
        </form>
          
        {/* Link to login page */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}