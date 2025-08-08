// src/components/pages/PostLoginLandingPage.jsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

// IMPORTANT: You will need to ensure your CSS files are properly imported or linked in your React project.
// For example, in your src/index.js or App.js, you might add:
// import '../../assets/css2/animate.css';
// import '../../assets/css2/owl.carousel.min.css';
// import '../../assets/css2/magnific-popup.css';
// import '../../assets/css2/bootstrap-datepicker.css';
// import '../../assets/css2/jquery.timepicker.css';
// import '../../assets/css2/flaticon.css';
// import '../../assets/css2/style.css'; // This is likely your main stylesheet
// import '../../assets/css2/parallax.css';
// Adjust paths based on where you place these CSS files.

const PostLoginLandingPage = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    // This useEffect can be used for any component-specific initialization
    // For example, if you have any animations or interactive elements
    // that rely on JavaScript, you would initialize them here.
    // However, direct porting of jQuery-based scripts (like js2/*.js)
    // usually requires re-writing them in a React-friendly way using useRef and state.
  }, []);

  return (
    <div className="ftco-loader">
      {/* Hero Section */}
      <section
        className="hero-wrap hero-wrap-2 js-fullheight"
        style={{ backgroundImage: 'url("images/bg_1.jpg")', backgroundAttachment: 'fixed' }}
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center">
            <div className="col-md-9 ftco-animate pb-5 text-center">
              <p className="breadcrumbs">
                <span className="mr-2">
                  <Link to="/">Home <i className="fa fa-chevron-right"></i></Link>
                </span>{' '}
                <span>Dashboard <i className="fa fa-chevron-right"></i></span>
              </p>
              <h1 className="mb-0 bread">Welcome, {currentUser?.fullName || currentUser?.email}!</h1>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="ftco-section ftco-no-pt ftco-no-pb">
        <div className="container">
          <div className="row no-gutters">
            <div className="col-md-6 p-md-5 img img-2 d-flex justify-content-center align-items-center"
              style={{ backgroundImage: 'url("images/about.jpg")' }}
            ></div>
            <div className="col-md-6 wrap-about ftco-animate">
              <div className="heading-section-bold mb-4 mt-md-5">
                <div className="ml-md-0">
                  <h2 className="mb-4">Welcome to FarmFriend <br /> An eCommerce & AI Solution for Farmers, Sellers, & Help Seekers</h2>
                </div>
              </div>
              <div className="pb-md-5">
                <p>
                  At FarmFriend, we are cultivating a community where agriculture meets innovation. Our platform is designed
                  to empower farmers with cutting-edge AI insights for their crop fields, connect sellers with a broader
                  market for their produce, and provide product buyers with direct access to fresh, quality farm products.
                </p>
                <p>
                  With real-time weather updates, AI-driven recommendations, and a dedicated chat service, we are here
                  to help you grow smarter, sell better, and buy fresher. Explore our features and join our thriving
                  agricultural network.
                </p>
                <p>
                  <Link to="/ai-recommendations" className="btn btn-primary">Discover AI Insights</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="ftco-section testimony-section img" style={{ backgroundImage: 'url("images/bg_2.jpg")' }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 text-center heading-section heading-section-white ftco-animate">
              <span className="subheading">What We Offer</span>
              <h2 className="mb-3">Our Core Services</h2>
            </div>
          </div>
          <div className="row ftco-animate">
            <div className="col-md-12">
              <div className="carousel-testimony owl-carousel ftco-owl">
                <div className="item">
                  <div className="testimony-wrap py-4">
                    <div className="text">
                      <p className="mb-4">
                        Get personalized AI-driven tips and suggestions for your crop fields based on real-time data and agricultural best practices.
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="user-img" style={{ backgroundImage: 'url("images/icon-ai.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                        <div className="ml-3">
                          <p className="name">AI Recommendations</p>
                          <span className="position">Smart Farming</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap py-4">
                    <div className="text">
                      <p className="mb-4">
                        Connect with product buyers directly, manage your inventory, and expand your market reach with our easy-to-use e-commerce tools.
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="user-img" style={{ backgroundImage: 'url("images/icon-seller.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                        <div className="ml-3">
                          <p className="name">Seller Portal</p>
                          <span className="position">Grow Your Business</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap py-4">
                    <div className="text">
                      <p className="mb-4">
                        Access a wide variety of fresh agricultural products directly from farmers and trusted sellers. Enjoy quality produce at fair prices.
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="user-img" style={{ backgroundImage: 'url("images/icon-buyer.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                        <div className="ml-3">
                          <p className="name">Product Buyer</p>
                          <span className="position">Fresh & Local</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap py-4">
                    <div className="text">
                      <p className="mb-4">
                        Engage with our AI chatbot for immediate answers to your crop queries, farming techniques, and market trends. Your virtual agricultural expert.
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="user-img" style={{ backgroundImage: 'url("images/icon-chat.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
                        <div className="ml-3">
                          <p className="name">Chat with AI</p>
                          <span className="position">Instant Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for other sections like CTA, Footer etc. from original HTML */}
      {/* Assuming the Header component already provides navigation,
          and the main App.js handles the overall layout including footer.
          If your original HTML footer is desired, it should be extracted
          into a separate Footer component or placed directly in App.js. */}

    </div>
  );
};

export default PostLoginLandingPage;