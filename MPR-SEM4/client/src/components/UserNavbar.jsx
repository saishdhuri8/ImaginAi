import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHome, FaImage, FaBars, FaTimes, FaCog, FaEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "../Firebase";
import { Link } from "react-router";
import { useLocation } from "react-router"

const UserNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profilePic = useSelector((state) => state.profilePic);
  const name = useSelector((state) => state.name);
  const navigate = useNavigate();
  const root = useSelector(state => state.rootFolderId);
  const { pathname } = useLocation();

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handelSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-200"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile User Info */}
          <div className="flex items-center space-x-3">
            {/* <img
              src="https://via.placeholder.com/40"
              alt="Logo"
              className="w-9 h-9 rounded-full border-2 border-purple-500"
            /> */}
            <div className="md:hidden flex flex-col">
              <span className="text-sm font-bold text-gray-800">
                <span className="text-purple-600">Imagine</span>AI
              </span>
              <span className="text-xs text-gray-600 truncate max-w-[120px]">
                {name}
              </span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden md:block">
              <span className="text-purple-600">Imagine</span>AI
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FaTimes size={20} />
            ) : (
              <FaBars size={20} />
            )}
          </button>
          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to={`/user/home/${root}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <FaHome size={18} />
                <span className="font-medium">Home</span>
              </motion.div>
            </Link>

            <Link to="/user/text-to-image">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <FaImage size={18} />
                <span className="font-medium">Text to Image</span>
              </motion.div>
            </Link>

            <Link to="/user/prompt-to-edit">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <FaEdit size={18} />
                <span className="font-medium">AI Image Editor</span>
              </motion.div>
            </Link>
          </div>

          {/* Profile Dropdown (Desktop) */}
          <div className="hidden md:block relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <img
                src={profilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
              />
              <span className="font-medium">{name}</span>
            </motion.button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-200 z-99999999"
              >
                <motion.a
                  whileHover={{ x: 5 }}
                  href="#"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaCog className="mr-3 text-gray-500" />
                  <span>Settings</span>
                </motion.a>

                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={handelSignOut}
                  className="w-full text-left flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <FiLogOut className="mr-3 text-gray-500" />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Menu (Hidden on Desktop) */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-2 pb-4 bg-white rounded-lg border border-gray-200 shadow-lg mx-2"
            style={{ marginBottom: '80px' }} // Add space at the bottom to prevent overlap
          >
            <div className="flex items-center px-5 py-3 border-b border-gray-200">
              <img
                src={profilePic}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-500 mr-3"
              />
              <span className="font-medium text-gray-700">{name}</span>
            </div>
            <Link to={`/user/home/${root}`}>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FaHome className="mr-4 text-gray-500" />
                <span>Home</span>
              </motion.div>
            </Link>
            <Link to="/user/text-to-image">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FaImage className="mr-4 text-gray-500" />
                <span>Text to Image</span>
              </motion.div>
            </Link>
            <Link to="/user/prompt-to-edit">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FaEdit className="mr-4 text-gray-500" />
                <span>Prompt to Edit</span>
              </motion.div>
            </Link>
            <div className="border-t border-gray-200 mt-1 pt-1">
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FaCog className="mr-4 text-gray-500" />
                <span>Settings</span>
              </motion.a>
              <motion.button
                whileHover={{ x: 5 }}
                onClick={handelSignOut}
                className="flex items-center w-full px-5 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FiLogOut className="mr-4 text-gray-500" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default UserNavbar;