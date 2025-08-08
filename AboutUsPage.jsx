import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">About Us</h2>
        <p className="text-gray-700 text-lg">
          AgroFuture is dedicated to revolutionizing agriculture by empowering farmers with cutting-edge technology and valuable resources. Our platform aims to connect farmers, provide real-time data, and foster a thriving agricultural community.
        </p>
        <p className="text-gray-600 mt-4">More details coming soon!</p>
      </div>
    </div>
  );
};

export default AboutUsPage;
