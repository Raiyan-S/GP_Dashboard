import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from 'lucide-react';
import { login } from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await login(email, password);
      if (response.ok) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 300); // 300 milliseconds delay to ensure session token is properly set as cookie
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <div className="flex items-center justify-center mb-6">
          <Layout className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-semibold text-gray-900">FL-ALL Dashboard</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login</h2>

        {/* Note */}
        <p className="text-gray-600 mb-4">
          admin email: admin123@gmail.com, pass: admin123, when you register it will be clinic role (only model-trial page)
        </p>

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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}