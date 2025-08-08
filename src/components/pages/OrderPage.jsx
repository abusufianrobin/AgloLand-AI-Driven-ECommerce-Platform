import React from 'react';
// import { useAuth } from '../../contexts/authContext'; // Uncomment if you need user data here

const OrderPage = () => {
  // const { currentUser } = useAuth(); // Example: To display user-specific orders

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-red-700 mb-4">Your Orders</h2>
        <p className="text-gray-700 text-lg">
          View your past orders, track current shipments, and manage your purchased agricultural products.
        </p>
        <p className="text-gray-600 mt-4">Order history and tracking functionality coming soon!</p>
        {/* You can add more detailed UI here, fetching order data from Firestore */}
        {/* {currentUser && <p className=\"mt-4 text-gray-500\">Orders for {currentUser.fullName || currentUser.email}</p>} */}
      </div>
    </div>
  );
};

export default OrderPage;
