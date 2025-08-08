// src/components/auth/login/LogIn_index.jsx

import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setErrorMessage("Please select a role.");
      return;
    }

    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage("");

      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (err) {
        let errorMsg = "Failed to log in. Please check your credentials.";
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          errorMsg = "Invalid email or password.";
        } else if (err.code === "auth/invalid-email") {
          errorMsg = "Invalid email address format.";
        }
        setErrorMessage(errorMsg);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div>
      {/* Redirect to the new post-login landing page */}
      {userLoggedIn && <Navigate to={"/dashboard-landing"} replace={true} />}

      <main className="w-full flex self-center place-content-center h-screen">
        <div className="p-4 sm:p-6 lg:p-8 space-y-5 shadow-xl rounded-xl w-full sm:w-2/3 md:w-1/2 lg:w-1/3 self-center bg-white border border-gray-200">
          <h3 className="text-2xl md:text-3xl font-bold text-green-700 text-center">
            Login to AgroFuture
          </h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="********"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role</label>
              <select
                id="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">-- Select Your Role --</option>
                <option value="farmer">🧑‍🌾 Farmer</option>
                <option value="seller">💰 Product Seller</option>
                <option value="buyer">🧺 Product Buyer</option>
                <option value="helper">❓ Help-Seeker</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 rounded"
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-green-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {errorMessage && (
              <span className="text-red-600 font-bold text-sm">{errorMessage}</span>
            )}

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
            >
              {isSigningIn ? "Logging In..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;