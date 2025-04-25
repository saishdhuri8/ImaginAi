import React, { useState } from "react";
import { useFirebase } from "../../Firebase";
import { Link } from "react-router";
import { createUserAtServer } from "../../API/user.api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  const firebase = useFirebase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    const res = await firebase.signup(email, password);


    if (res) {
      const status = await createUserAtServer(res);
      if (status > 300) {
        setErrorMessage("Failed to create an account. Please try again.");
      }
    }
    else {
      setErrorMessage("Failed to create an account. Please try again.");
    }

  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const res = await firebase.signinByGoogle();

    if (res) {
      const status = await createUserAtServer(res);
      if (status > 300) {
        setErrorMessage("Failed to create an account. Please try again.");
      }
    }
    else {
      setErrorMessage("Failed to create an account. Please try again.");
    }

    
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Spline 3D Background */}
      <div className="fixed inset-0 z-0">
        <spline-viewer 
          url="https://prod.spline.design/TZKgDPemNJ7RI-bE/scene.splinecode"
          className="w-full h-full"
        ></spline-viewer>
      </div>

      {/* Signup Form */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-white/20">
        <h2 className="text-4xl font-bold text-purple-900 mb-8 text-center">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/80 border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-800 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/80 border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>

          {/* Error Message */}
          {errorMessage.length > 0 && (
            <p className="text-red-600 text-sm text-center mb-4">
              {errorMessage}
            </p>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-purple-200"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-purple-100"></div>
          <span className="mx-4 text-purple-500">or</span>
          <div className="flex-grow border-t border-purple-100"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white/90 border border-purple-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-white transition-all shadow hover:shadow-purple-100"
          onClick={handleGoogleAuth}
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Logo"
            className="w-6 h-6"
          />
          <span className="font-medium">Continue with Google</span>
        </button>

        {/* Login Link */}
        <p className="mt-8 text-center text-gray-700">
          Already have an account?{" "}
          <Link 
            to={"/login"} 
            className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;


