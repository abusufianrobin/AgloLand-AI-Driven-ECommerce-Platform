import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Contact Us</h2>
        <p className="text-gray-700 text-lg mb-4">
          Have questions or feedback? Reach out to us through the following channels:
        </p>
        <div className="space-y-2 text-left inline-block">
          <p className="text-gray-800"><span className="font-semibold">Email:</span> support@agrofuture.com</p>
          <p className="text-gray-800"><span className="font-semibold">Phone:</span> +880 1700-123456</p>
          <p className="text-gray-800"><span className="font-semibold">Address:</span> 123 Agro Lane, Farm City, Bangladesh</p>
        </div>
        <p className="text-gray-600 mt-4">We're here to help!</p>
      </div>
    </div>
  );
};

export default ContactUsPage;
