import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Import Firestore instance
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { useAuth } from '../../contexts/authContext'; // To get current user details

const BlogPage = () => {
  const { currentUser } = useAuth(); // Get logged-in user
  const [username, setUsername] = useState(currentUser?.fullName || currentUser?.email || "");
  const [avatar, setAvatar] = useState(currentUser?.photoURL || "https://placehold.co/150x150/CCEBD0/333333?text=User"); // Default avatar
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [language, setLanguage] = useState('en'); // State for language toggle
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState('');

  // Effect to fetch blog posts from Firestore in real-time
  useEffect(() => {
    // Create a query to the 'blogs' collection, ordered by creation time
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      setBlogPosts(posts); // Update state with fetched posts
    }, (error) => {
      console.error("Error fetching blog posts: ", error);
      // Handle error, e.g., display a message to the user
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  // Update username and avatar if currentUser changes (e.g., after login)
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.fullName || currentUser.email || "");
      setAvatar(currentUser.photoURL || "https://placehold.co/150x150/CCEBD0/333333?text=User");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setPostError("You must be logged in to post a blog.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setPostError("Title and content cannot be empty.");
      return;
    }

    setIsPosting(true);
    setPostError('');

    try {
      // Add a new document to the 'blogs' collection
      const blogDocRef = await addDoc(collection(db, 'blogs'), {
        username: username,
        avatar: avatar,
        title: title,
        content: content,
        date: new Date().toLocaleDateString(), // Or use a more specific format
        createdAt: serverTimestamp(), // Use server timestamp for consistent ordering
        userId: currentUser.uid, // Store user ID for ownership checks if needed
      });

      // Log activity to userActivities collection
      await addDoc(collection(db, 'userActivities'), {
        userId: currentUser.uid,
        type: 'Blog Post',
        description: `Posted a new blog: '${title}'`,
        timestamp: serverTimestamp(),
        linkedDocId: blogDocRef.id, // Link to the actual blog document
      });

      // Clear the form fields after successful submission
      setTitle('');
      setContent('');
    } catch (error) {
      console.error("Error adding document or logging activity: ", error);
      setPostError("Failed to post blog. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const sharePost = (postTitle, postContent) => {
    if (navigator.share) {
      // Use Web Share API if available
      navigator.share({
        title: postTitle,
        text: postContent,
        url: window.location.href, // Share the current page URL
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      // You could implement a custom share modal here
      const shareText = `Check out this blog post: "${postTitle}" - ${postContent.substring(0, 100)}... Read more at ${window.location.href}`;
      document.execCommand('copy'); // Use document.execCommand for clipboard in iframes
      // navigator.clipboard.writeText(shareText) // navigator.clipboard.writeText might not work in iframes
      //   .then(() => alert('Post details copied to clipboard! You can paste and share it manually.'))
      //   .catch((error) => console.error('Error copying to clipboard:', error));
      alert('Post details copied to clipboard! You can paste and share it manually.');
    }
  };

  // Language content mapping
  const contentMap = {
    en: {
      pageTitle: '🌱 Agro Blog',
      pageDesc: 'Share your knowledge, tips, or stories!',
      writeBlog: 'Write a New Blog',
      usernamePlaceholder: 'Your Name',
      titlePlaceholder: 'Blog Title',
      contentPlaceholder: 'What\'s on your mind?',
      postButton: 'Post Blog',
      noPosts: 'No blog posts yet. Be the first to share!',
      share: '🔗 Share',
      loginToPost: 'Please log in to post a blog.'
    },
    bn: {
      pageTitle: '🌱 এগ্রো ব্লগ',
      pageDesc: 'আপনার জ্ঞান, টিপস, বা গল্প শেয়ার করুন!',
      writeBlog: 'নতুন ব্লগ লিখুন',
      usernamePlaceholder: 'আপনার নাম',
      titlePlaceholder: 'ব্লগের শিরোনাম',
      contentPlaceholder: 'আপনার মনে কী আছে?',
      postButton: 'ব্লগ পোস্ট করুন',
      noPosts: 'এখনও কোনো ব্লগ পোস্ট নেই। প্রথম হন!',
      share: '🔗 শেয়ার করুন',
      loginToPost: 'ব্লগ পোস্ট করার জন্য অনুগ্রহ করে লগ ইন করুন।'
    }
  };

  const t = contentMap[language]; // 't' for translation

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Language Toggle */}
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

        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700">{t.pageTitle}</h1>
          <p className="text-gray-600 mt-2">{t.pageDesc}</p>
        </div>

        {/* Blog Post Form */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold text-green-800 mb-4">{t.writeBlog}</h2>
          {!currentUser ? (
            <p className="text-red-500 font-medium text-center">{t.loginToPost}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl w-full"
                placeholder={t.usernamePlaceholder}
                disabled={!!currentUser?.fullName} // Disable if full name is available
              />
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl w-full"
                placeholder={t.titlePlaceholder}
              />
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl w-full h-32 resize-y"
                placeholder={t.contentPlaceholder}
              ></textarea>
              {postError && <p className="text-red-500 text-sm">{postError}</p>}
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                disabled={isPosting || !currentUser}
              >
                {isPosting ? 'Posting...' : t.postButton}
              </button>
            </form>
          )}
        </div>

        {/* Blog Feed */}
        <div id="blogFeed" className="space-y-6">
          {blogPosts.length === 0 ? (
            <p className="text-gray-600 text-center">{t.noPosts}</p>
          ) : (
            blogPosts.map((post) => (
              <div key={post.id} className="bg-white p-5 rounded-xl shadow flex items-start gap-4">
                <img src={post.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="flex justify-between items-center flex-wrap">
                    <h3 className="text-lg font-bold text-green-800">{post.title}</h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : post.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">by {post.username}</p>
                  <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                  <div className="mt-2">
                    <button
                      onClick={() => sharePost(post.title, post.content)}
                      className="text-sm text-green-600 hover:underline"
                    >
                      {t.share}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
