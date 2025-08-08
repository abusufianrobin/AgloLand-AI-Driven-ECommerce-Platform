import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/authContext';

const StorehouseRentPage = () => {
  const { currentUser } = useAuth();
  const [owner, setOwner] = useState(currentUser?.fullName || currentUser?.email || "");
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [details, setDetails] = useState('');
  const [proposals, setProposals] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'storehouseRentals'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setProposals(items);
    }, (error) => {
      console.error("Error fetching storehouse proposals: ", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setOwner(currentUser.fullName || currentUser.email || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setFormError("You must be logged in to submit a proposal.");
      return;
    }
    if (!owner.trim() || !location.trim() || !size || !price || !details.trim()) {
      setFormError("All form fields are required.");
      return;
    }
    if (isNaN(size) || parseInt(size) <= 0) {
      setFormError("Size must be a positive number.");
      return;
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      setFormError("Price must be a positive number.");
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const proposalDocRef = await addDoc(collection(db, 'storehouseRentals'), {
        owner,
        location,
        size: parseInt(size),
        price: parseFloat(price),
        details,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
      });

      // Log activity to userActivities collection
      await addDoc(collection(db, 'userActivities'), {
        userId: currentUser.uid,
        type: 'Storehouse Proposal',
        description: `Submitted storehouse proposal for '${location}'`,
        timestamp: serverTimestamp(),
        linkedDocId: proposalDocRef.id,
      });

      setOwner(currentUser?.fullName || currentUser?.email || "");
      setLocation('');
      setSize('');
      setPrice('');
      setDetails('');
      setMessage(t.proposalSuccess);
    } catch (error) {
      console.error("Error adding document or logging activity: ", error);
      setFormError("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const contentMap = {
    en: {
      pageTitle: '🏢 Storehouse Rental Proposal',
      ownerPlaceholder: 'Owner Name',
      locationPlaceholder: 'Storehouse Location',
      sizePlaceholder: 'Size in sq ft',
      pricePlaceholder: 'Monthly Rent (৳)',
      detailsPlaceholder: 'Additional details (e.g., amenities, access)',
      submitButton: 'Submit Proposal',
      proposalSuccess: 'Proposal submitted successfully!',
      noProposals: 'No proposals yet.',
      viewDetails: 'View Details',
      contactOwner: 'Contact Owner',
      contactOwnerMessage: 'Please visit agrofuture.com/contact or call our hotline for owner details.'
    },
    bn: {
      pageTitle: '🏢 গোদামাগার ভাড়া প্রস্তাব',
      ownerPlaceholder: 'মালিকের নাম',
      locationPlaceholder: 'গোদামাগারের অবস্থান',
      sizePlaceholder: 'আকার (বর্গফুট)',
      pricePlaceholder: 'মাসিক ভাড়া (৳)',
      detailsPlaceholder: 'অতিরিক্ত বিবরণ (যেমন: সুবিধা, অ্যাক্সেস)',
      submitButton: 'প্রস্তাব জমা দিন',
      proposalSuccess: 'প্রস্তাব সফলভাবে জমা দেওয়া হয়েছে!',
      noProposals: 'এখনো কোনো প্রস্তাব নেই।',
      viewDetails: 'বিস্তারিত দেখুন',
      contactOwner: 'মালিকের সাথে যোগাযোগ করুন',
      contactOwnerMessage: 'মালিকের বিস্তারিত তথ্যের জন্য অনুগ্রহ করে agrofuture.com/contact ভিজিট করুন অথবা আমাদের হটলাইন-এ কল করুন।'
    }
  };

  const t = contentMap[language];

  return (
    <div className="bg-green-50 py-10 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <select
            id="languageToggle"
            className="border border-gray-300 rounded px-3 py-1"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>

        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">{t.pageTitle}</h1>

        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Submit Your Proposal</h2>
          {!currentUser ? (
            <p className="text-red-500 font-medium text-center">{t.loginToPost || 'Please log in to submit a proposal.'}</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl"
                placeholder={t.ownerPlaceholder}
                disabled={!!currentUser?.fullName}
              />
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl"
                placeholder={t.locationPlaceholder}
              />
              <input
                type="number"
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                min="1"
                className="px-4 py-2 border border-gray-300 rounded-xl"
                placeholder={t.sizePlaceholder}
              />
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0.01"
                step="0.01"
                className="px-4 py-2 border border-gray-300 rounded-xl"
                placeholder={t.pricePlaceholder}
              />
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl h-24 resize-y"
                placeholder={t.detailsPlaceholder}
              ></textarea>
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                disabled={isSubmitting || !currentUser}
              >
                {isSubmitting ? 'Submitting...' : t.submitButton}
              </button>
            </form>
          )}
          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl text-center">
              {message}
            </div>
          )}
        </div>

        <h2 className="text-3xl font-semibold text-center mb-6 text-green-700">All Storehouse Proposals</h2>
        <div id="proposalList" className="grid md:grid-cols-2 gap-6">
          {proposals.length === 0 ? (
            <p className="text-gray-600 text-center col-span-full">{t.noProposals}</p>
          ) : (
            proposals.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-green-800">{item.location}</h3>
                <p className="text-sm text-gray-600">Owner: {item.owner}</p>
                <p className="text-sm text-gray-600">Size: {item.size} sq ft</p>
                <p className="text-sm text-gray-600">Price: ৳{item.price}/month</p>
                <p className="text-sm text-gray-700 mt-2">{item.details}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => showMessage(t.contactOwnerMessage)}
                    className="bg-blue-600 text-white px-4 py-1 rounded-xl hover:bg-blue-700 transition"
                  >
                    {t.contactOwner}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StorehouseRentPage;
