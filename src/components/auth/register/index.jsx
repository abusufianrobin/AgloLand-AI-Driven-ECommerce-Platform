import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'; // Updated path
import { doCreateUserWithEmailAndPassword, doCreateUser } from '../../../firebase/auth';

const Register = () => {
  const { userLoggedIn } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setErrorMessage("Please select a role.");
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      setErrorMessage("");

      try {
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await doCreateUser(user, fullName, phone, role);

      } catch (err) {
        let errorMsg = "Failed to register. Please try again.";
        if (err.code === "auth/email-already-in-use") {
          errorMsg = "This email is already in use.";
        } else if (err.code === "auth/invalid-email") {
          errorMsg = "Invalid email address format.";
        } else if (err.code === "auth/weak-password") {
          errorMsg = "Password is too weak (min 6 characters).";
        }
        setErrorMessage(errorMsg);
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <main className="bg-green-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
                Create Your Agro Account
              </h2>
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Abdul Karim"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="example@agro.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Register As
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="">-- Select Role --</option>
                    <option value="seller">🛒 Agro Seller</option>
                    <option value="buyer">🧺 Product Buyer</option>
                    <option value="helper">❓ Ask for Agro Help</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Create a password"
                  />
                </div>

                {errorMessage && (
                  <span className="text-red-600 font-bold text-sm">{errorMessage}</span>
                )}

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                >
                  {isRegistering ? "Signing Up..." : "Sign Up"}
                </button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            <div className="bg-green-100 p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Need Help?
              </h3>
              <p className="mb-4 text-gray-700">
                Whether you're a seller, a customer, or just need agro advice — we're here for you.
              </p>
              <div className="mb-2">
                <span className="font-semibold text-green-800">📞 Hotline:</span>{" "}
                <span className="text-gray-800">+880 1700-123456</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-green-800">💬 Help Desk:</span>{" "}
                <span className="text-gray-800">support@agrofuture.com</span>
              </div>
              <div className="mt-6 text-sm text-gray-600">
                Our support team is available 24/7 to assist all users.
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;
