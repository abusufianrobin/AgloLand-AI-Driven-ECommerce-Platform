import React from 'react'
import { Link } from 'react-router-dom';
// The useAuth import is not strictly necessary on the Home component unless you render
// something conditionally based on auth status here.
// import { useAuth } from '../../contexts/authContext';


const Home = () => {
    return (
        <div className="bg-green-50 text-gray-800 min-h-screen flex flex-col">

            {/* Hero Section */}
            <section className="text-center py-20 bg-green-100 flex-1 flex items-center justify-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-4 leading-tight">
                        Empowering Farmers with Technology
                    </h2>
                    <p className="text-lg md:text-xl mb-6 text-gray-700">
                        AgroFuture connects farmers with smart tools, weather alerts, market prices, and expert advice to cultivate success.
                    </p>
                    <Link
                        to="/register"
                        className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition transform hover:scale-105 inline-block shadow-lg"
                    >
                        Get Started Today!
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-700">
                        Key Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Smart Crop Management", desc: "Optimize your yields with AI-driven insights on planting, irrigation, and harvesting." },
                            { title: "Real-time Weather Alerts", desc: "Get instant notifications for rainfall, temperature changes, and adverse weather conditions." },
                            { title: "Market Price Insights", desc: "Stay updated with the latest market prices for your produce to maximize profits." },
                            { title: "Expert Consultations", desc: "Connect directly with agricultural experts for personalized advice and problem-solving." },
                            { title: "E-commerce Marketplace", desc: "Buy and sell agricultural products directly, ensuring fair prices and wide reach." },
                            { title: "Equipment Rental", desc: "Easily find and rent farming machinery and tools from local providers." }
                        ].map((feature, index) => (
                            <div key={index} className="bg-green-50 shadow-md rounded-xl p-6 transform hover:scale-105 transition-transform duration-200 ease-in-out border border-green-200">
                                <h4 className="text-xl font-semibold text-green-600 mb-2">{feature.title}</h4>
                                <p className="text-gray-700">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="bg-green-50 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h3 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">About AgroFuture</h3>
                    <p className="text-lg text-gray-800 leading-relaxed">
                        Our mission is to revolutionize agriculture in Bangladesh and beyond by providing farmers with smart, accessible, and sustainable solutions. We believe in harnessing technology to build a more prosperous and resilient agricultural community.
                    </p>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-green-200 text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Ready to Grow Smarter?</h3>
                <p className="mb-8 text-lg text-gray-700">Join AgroFuture today and transform the way you farm with our innovative tools and supportive community.</p>
                <Link
                    to="/register"
                    className="bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-800 transition transform hover:scale-105 inline-block shadow-lg"
                >
                    Sign Up Now
                </Link>
            </section>

            {/* Footer */}
            <footer className="bg-white text-gray-600 py-8 border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} AgroFuture. All rights reserved.</p>
                    <div className="mt-2 space-x-4">
                        <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
