import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-green-100 px-4 py-3 shadow-md">
      <Link to="/" className="text-xl font-bold text-green-700">
        AgroFuture
      </Link>

      <div className="flex gap-4 items-center">
        {userLoggedIn ? (
          <>
            <Link to="/weather-updates" className="text-green-700 hover:underline transition-colors duration-200">Weather Updates</Link>
            <Link to="/ai-recommendations" className="text-green-700 hover:underline transition-colors duration-200">AI Recommendations</Link>
            <Link to="/chat-with-ai" className="text-green-700 hover:underline transition-colors duration-200">Chat with AI</Link>
            <Link to="/blog" className="text-green-700 hover:underline transition-colors duration-200">Blog</Link>
            <Link to="/rent" className="text-green-700 hover:underline transition-colors duration-200">Instrument Rent</Link> {/* Clarified "Rent" link */}
            <Link to="/storehouse-rent" className="text-green-700 hover:underline transition-colors duration-200">Storehouse Rent</Link> {/* NEW Link */}
            <Link to="/order" className="text-green-700 hover:underline transition-colors duration-200">Order</Link>
            <Link to="/dashboard" className="text-green-700 hover:underline transition-colors duration-200">
              Dashboard
            </Link>
            {currentUser && (
              <span className="text-green-800 font-semibold text-sm">
                Hello, {currentUser.fullName ? currentUser.fullName.split(' ')[0] : currentUser.email.split('@')[0]}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="text-green-700 hover:underline transition-colors duration-200">Home</Link>
            <Link to="/about-us" className="text-green-700 hover:underline transition-colors duration-200">About Us</Link>
            <Link to="/contact-us" className="text-green-700 hover:underline transition-colors duration-200">Contact Us</Link>
            <Link to="/login" className="text-green-700 hover:underline transition-colors duration-200">
              Login
            </Link>
            <Link to="/register" className="text-white bg-green-600 px-3 py-1 rounded-md hover:bg-green-700 transition-colors duration-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
