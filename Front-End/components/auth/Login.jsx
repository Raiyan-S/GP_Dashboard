import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { Layout } from 'lucide-react'; // Icon from Lucide
import { login } from "../../services/api"; // Import the login function from the API service
import { AuthContext } from './AuthContext'; // Import the AuthContext to manage authentication state

// Used in App.jsx
export default function Login({ setActiveTab }) {
  const [email, setEmail] = useState(''); // State to manage email input
  const [password, setPassword] = useState(''); // State to manage password input
  const [error, setError] = useState(''); // State to manage error messages
  const [loading, setLoading] = useState(false); // State to manage loading state
  const { refreshAuthState } = useContext(AuthContext); // Use the AuthContext to refresh authentication state
  const navigate = useNavigate(); 

  // Set the active tab to "login" when the component is rendered
  useEffect(() => {
    setActiveTab('login');
  }, [setActiveTab]);

  // This function is called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default page refresh
    setError('');
    setLoading(true);

    // Login and refresh authentication state
    // If the login is successful, navigate to the appropriate page based on the user role
    try {
      const response = await login(email, password); // Call the login function from the API service
      console.log('DEBUG: Login successful:', response);

      // Refresh authentication state
      await refreshAuthState();

      if (response.role === 'admin') { // Navigate to the dashboard if the user is an admin
        console.log('DEBUG: Navigating to /dashboard');
        setActiveTab('dashboard');
        navigate('/dashboard');
      } else if (response.role === 'clinic') { // Navigate to the model trial page if the user is a clinic
        console.log('DEBUG: Navigating to /model-trial');
        setActiveTab('model-trial');
        navigate('/model-trial');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        {/* Logo and title in login page*/}
        <div className="flex items-center justify-center mb-6">
          <Layout className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-semibold text-gray-900">FL-ALL Dashboard</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login</h2>

        {/* Display error message if there's any */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
          
        {/* Login form */}
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
          {/* The button is disabled when loading is true (when the handleSubmit is called)*/}
          <button type="submit" className={"w-full p-2 rounded-md transition-colors bg-blue-500 hover:bg-blue-600 text-white"}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Link to register page */}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}