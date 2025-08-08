// src/App.js

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/authContext';
import Header from './components/header';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Home from './components/home';
import Dashboard from './components/dashboard/Dashboard';
import PostLoginLandingPage from './components/pages/PostLoginLandingPage'; // NEW: Import the new landing page

// Placeholder Pages - now includes the fully functional WeatherUpdatesPage
import AboutUsPage from './components/pages/AboutUsPage';
import AIRecommendationsPage from './components/pages/AIRecommendationsPage';
import BlogPage from './components/pages/BlogPage';
import ChatWithAIPage from './components/pages/ChatWithAIPage';
import ContactUsPage from './components/pages/ContactUsPage';
import OrderPage from './components/pages/OrderPage';
import RentPage from './components/pages/RentPage';
import StorehouseRentPage from './components/pages/StorehouseRentPage';
import WeatherUpdatesPage from './components/pages/WeatherUpdatesPage';

// Import Firestore related functions and db (for optional test code or future use)
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';

function App() {
  // Optional: Firestore test code. You can remove this useEffect if not actively debugging.
  useEffect(() => {
    const testFirestore = async () => {
      try {
        const docRef = doc(db, "testCollection", "testDocument");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Firestore Test: Document data:", docSnap.data());
        } else {
          console.log("Firestore Test: No such document! (Create 'testCollection/testDocument' in Firestore to test)");
        }
      } catch (error) {
        console.error("Firestore Test Error:", error);
      }
    };
    // testFirestore(); // Uncomment to run the Firestore test on app load
  }, []);

  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* NEW: Route for the post-login landing page */}
        <Route path="/dashboard-landing" element={<PostLoginLandingPage />} />

        {/* Routes for Authenticated Users */}
        <Route path="/weather-updates" element={<WeatherUpdatesPage />} />
        <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
        <Route path="/chat-with-ai" element={<ChatWithAIPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/rent" element={<RentPage />} />
        <Route path="/storehouse-rent" element={<StorehouseRentPage />} />
        <Route path="/order" element={<OrderPage />} />
        {/* Routes for Guest Users */}
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

