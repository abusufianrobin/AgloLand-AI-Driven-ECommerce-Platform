import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/authContext';

const RentPage = () => {
  const { currentUser } = useAuth();
  const [equipment, setEquipment] = useState('');
  const [image, setImage] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [owner, setOwner] = useState(currentUser?.fullName || currentUser?.email || "");
  const [details, setDetails] = useState('');
  const [rentals, setRentals] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isListing, setIsListing] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'instrumentRentals'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setRentals(items);
    }, (error) => {
      console.error("Error fetching rentals: ", error);
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
      setFormError("You must be logged in to list equipment.");
      return;
    }
    if (!equipment.trim() || !location.trim() || !price || !details.trim()) {
      setFormError("All form fields are required.");
      return;
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      setFormError("Price must be a positive number.");
      return;
    }

    setIsListing(true);
    setFormError('');

    try {
      const rentalDocRef = await addDoc(collection(db, 'instrumentRentals'), {
        equipment,
        image: image || "https://placehold.co/400x200/D4EDDA/333333?text=Agro+Equipment",
        location,
        price: parseFloat(price),
        owner,
        details,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
      });

      // Log activity to userActivities collection
      await addDoc(collection(db, 'userActivities'), {
        userId: currentUser.uid,
        type: 'Instrument Listing',
        description: `Listed instrument: '${equipment}' for rent`,
        timestamp: serverTimestamp(),
        linkedDocId: rentalDocRef.id,
      });

      setEquipment('');
      setImage('');
      setLocation('');
      setPrice('');
      setDetails('');
      setMessage(t.listingSuccess);
    } catch (error) {
      console.error("Error adding document or logging activity: ", error);
      setFormError("Failed to list equipment. Please try again.");
    } finally {
      setIsListing(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const contentMap = {
    en: {
      pageTitle: '🚜 Farming Equipment Rental',
      pageDesc: 'Find, list, and rent farming tools easily',
      listEquipment: 'List Your Equipment for Rent',
      equipmentPlaceholder: 'Equipment Name (e.g., Tractor, Seeder)',
      imagePlaceholder: 'Image URL (optional)',
      locationPlaceholder: 'Your Location (District/Area)',
      pricePlaceholder: 'Rental Price per day (৳)',
      ownerPlaceholder: 'Your Name',
      detailsPlaceholder: 'Brief description of equipment and condition',
      submitButton: 'Submit Listing',
      rentalList: 'Available Equipment for Rent',
      rentNow: 'Rent Now',
      contactDealer: 'Contact Dealer',
      listingSuccess: 'Equipment listed successfully!',
      rentMessage: 'Thank you! Our AgroFuture team will contact you shortly.',
      contactMessage: 'Visit agrofuture.com/contact or call our hotline: 096XX-XXXXXXXX.',
      loginToList: 'Please log in to list equipment for rent.'
    },
    bn: {
      pageTitle: '🚜 কৃষিযন্ত্র ভাড়া',
      pageDesc: 'সহজেই কৃষিযন্ত্র খুঁজুন, তালিকাভুক্ত করুন এবং ভাড়া দিন',
      listEquipment: 'ভাড়ার জন্য আপনার সরঞ্জাম তালিকাভুক্ত করুন',
      equipmentPlaceholder: 'সরঞ্জামের নাম (যেমন: ট্র্যাক্টর, সিডার)',
      imagePlaceholder: 'ছবির ইউআরএল (ঐচ্ছিক)',
      locationPlaceholder: 'আপনার অবস্থান (জেলা/এলাকা)',
      pricePlaceholder: 'প্রতিদিনের ভাড়া মূল্য (৳)',
      ownerPlaceholder: 'আপনার নাম',
      detailsPlaceholder: 'সরঞ্জাম এবং অবস্থার সংক্ষিপ্ত বিবরণ',
      submitButton: 'তালিকা জমা দিন',
      rentalList: 'ভাড়ার জন্য উপলব্ধ সরঞ্জাম',
      rentNow: 'এখন ভাড়া নিন',
      contactDealer: 'ডিলারের সাথে যোগাযোগ করুন',
      listingSuccess: 'সরঞ্জাম সফলভাবে তালিকাভুক্ত করা হয়েছে!',
      rentMessage: 'ধন্যবাদ! আমাদের এগ্রোফিউচার দল শীঘ্রই আপনার সাথে যোগাযোগ করবে।',
      contactMessage: 'agrofuture.com/contact ভিজিট করুন অথবা আমাদের হটলাইন: 096XX-XXXXXXXX-এ কল করুন।',
      loginToList: 'ভাড়ার জন্য সরঞ্জাম তালিকাভুক্ত করতে অনুগ্রহ করে লগ ইন করুন।'
    }
  };

  const t = contentMap[language];

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
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

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700">{t.pageTitle}</h1>
          <p className="text-gray-600 mt-2">{t.pageDesc}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold text-green-800 mb-4">{t.listEquipment}</h2>
          {!currentUser ? (
            <p className="text-red-500 font-medium text-center">{t.loginToList}</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                id="equipment"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl"
                placeholder={t.equipmentPlaceholder}
              />
              <input
                type="url"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl"
                placeholder={t.imagePlaceholder}
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
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0.01"
                step="0.01"
                className="px-4 py-2 border border-gray-300 rounded-xl"
                placeholder={t.pricePlaceholder}
              />
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
                disabled={isListing || !currentUser}
              >
                {isListing ? 'Submitting...' : t.submitButton}
              </button>
            </form>
          )}
          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl text-center">
              {message}
            </div>
          )}
        </div>

        <h2 className="text-3xl font-semibold text-center mb-6 text-green-700">{t.rentalList}</h2>
        <div id="equipmentList" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.length === 0 ? (
            <p className="text-gray-600 text-center col-span-full">No equipment listed yet. Be the first!</p>
          ) : (
            rentals.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-xl shadow-lg">
                <img src={item.image} alt={item.equipment} className="w-full h-40 object-cover rounded-xl mb-3"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/D4EDDA/333333?text=Image+Not+Found"; }}
                />
                <h3 className="text-xl font-bold text-green-800">{item.equipment}</h3>
                <p className="text-sm text-gray-600">Location: {item.location}</p>
                <p className="text-sm text-gray-600">Price: ৳{item.price}/day</p>
                <p className="text-sm text-gray-600">Owner: {item.owner}</p>
                <p className="text-sm text-gray-700 mt-2">{item.details}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => showMessage(t.rentMessage)}
                    className="bg-green-600 text-white px-4 py-1 rounded-xl hover:bg-green-700 transition"
                  >
                    {t.rentNow}
                  </button>
                  <button
                    onClick={() => showMessage(t.contactMessage)}
                    className="bg-blue-600 text-white px-4 py-1 rounded-xl hover:bg-blue-700 transition"
                  >
                    {t.contactDealer}
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

export default RentPage;
