import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { db } from '../../firebase/firebase'; // Import db
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'; // Import Firestore functions

const Dashboard = () => {
  const { currentUser } = useAuth(); // Access currentUser which contains fullName and role
  const [userActivities, setUserActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activityError, setActivityError] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      setLoadingActivities(true);
      setActivityError('');

      // Create a query to get activities for the current user, ordered by timestamp
      const activitiesQuery = query(
        collection(db, 'userActivities'),
        where('userId', '==', currentUser.uid), // Filter by current user's ID
        orderBy('timestamp', 'desc') // Order by the latest activity
      );

      // Set up a real-time listener for user activities
      const unsubscribe = onSnapshot(activitiesQuery, (snapshot) => {
        const activities = [];
        snapshot.forEach((doc) => {
          activities.push({ id: doc.id, ...doc.data() });
        });
        setUserActivities(activities);
        setLoadingActivities(false);
      }, (error) => {
        console.error("Error fetching user activities:", error);
        setActivityError("Failed to load activities.");
        setLoadingActivities(false);
      });

      // Cleanup the listener when the component unmounts or currentUser changes
      return () => unsubscribe();
    } else {
      setUserActivities([]); // Clear activities if no user is logged in
      setLoadingActivities(false);
    }
  }, [currentUser]); // Re-run effect when currentUser changes

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Welcome, {currentUser?.fullName || currentUser?.email || 'User'}!
        </h2>

        {/* Display User Role */}
        <div className="text-center mb-8">
          <p className="text-xl text-gray-700 font-semibold">
            Your Role:{" "}
            <span className="text-green-600">
              {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Not specified'}
            </span>
          </p>
        </div>

        {/* User Activities Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">Your Recent Activities</h3>
          {loadingActivities ? (
            <p className="text-gray-600 text-center">Loading activities...</p>
          ) : activityError ? (
            <p className="text-red-500 text-center">{activityError}</p>
          ) : userActivities.length === 0 ? (
            <p className="text-gray-600 text-center">No recent activities found.</p>
          ) : (
            <ul className="space-y-4">
              {userActivities.map((activity) => (
                <li key={activity.id} className="bg-green-100 p-4 rounded-xl shadow-sm flex items-start space-x-3">
                  <span className="text-green-700 text-lg">➡️</span>
                  <div>
                    <p className="text-lg font-medium text-gray-800">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {activity.timestamp ? new Date(activity.timestamp.toDate()).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
