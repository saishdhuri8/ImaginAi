import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux'

import {
  FaHome,
  FaImage,
  FaMagic,
  FaObjectGroup,
  FaPalette,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { auth } from "../Firebase";

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
  const profilePic = useSelector(state => state.profilePic);
  const name = useSelector(state => state.name);
  const navigate = useNavigate()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile); // Auto-collapse on small screens
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar collapse (Only on mobile screens)
  const toggleCollapse = () => {
    if (isMobile) setIsCollapsed(!isCollapsed);
  };

  const handelSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* Mobile Menu Button (Only visible on small screens) */}
      {isMobile && isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="fixed top-4 left-4 z-20 p-2 bg-purple-800 text-white rounded shadow-lg"
        >
          <HiMenu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: isCollapsed && isMobile ? "-100%" : "0%" }}
        animate={{ x: isCollapsed && isMobile ? "-100%" : "0%" }}
        transition={{ duration: 0.3 }}
        className={`h-screen bg-purple-900 text-white fixed top-0 left-0 z-30 w-[250px] flex flex-col ${isMobile ? "absolute" : "relative"
          }`}
      >
        {/* Header */}
        <div className="flex items-center py-6 px-4">
          <h1 className="text-2xl font-bold">ImageEditPro</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            {[
              { name: "Home", path: "/", icon: <FaHome size={20} /> },
              { name: "Image Restore", path: "/restore", icon: <FaImage size={20} /> },
              { name: "Generative Fill", path: "/fill", icon: <FaMagic size={20} /> },
              { name: "Object Remove", path: "/remove", icon: <FaTrash size={20} /> },
              { name: "Object Recolor", path: "/recolor", icon: <FaPalette size={20} /> },
              { name: "Background Remove", path: "/background", icon: <FaObjectGroup size={20} /> },
            ].map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center p-3 hover:bg-purple-800 rounded transition-colors"
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile (Pinned to Bottom) */}
        <div className="mt-auto py-6 border-t border-purple-800">
          <div className="flex items-center flex-col gap-2.5 justify-between px-4">
            <div className="flex items-center space-x-3">
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-purple-300">Admin</p>
              </div>
            </div>
            <button
              onClick={handelSignOut}
              className="bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>


      </motion.div>

      {/* Overlay (Only on Mobile when Sidebar is Open) */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20"
          onClick={toggleCollapse}
        />
      )}
    </>
  );
};

export default Sidebar;
