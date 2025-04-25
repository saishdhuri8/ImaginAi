import React, { useEffect, useState } from "react";
import { FaFolder, FaImage, FaPlus, FaUpload, FaTimes, FaSpinner } from "react-icons/fa";
import { FiFolderPlus, FiImage } from "react-icons/fi";
import { Link, useLocation, useNavigation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { addFolder, getFolderContents, uploadImage } from "../API/user.api";
import { motion, AnimatePresence } from "framer-motion";
import ImageCard from "./ImageCard";
import Folder from "./Folder";

const Home = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [folderName, setFolderName] = useState("");






  // State for Images & Folders
  const [images, setimages] = useState([]);
  const [folders, setfolders] = useState([]);
  const { parent } = useParams();
  const userId = useSelector(state => state.userId);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageUploadPopup, setShowImageUploadPopup] = useState(false);
  const [parentName, setParentName] = useState("");

  // Fetch Folder Contents
  useEffect(() => {
    const fetch = async () => {
      const response = await getFolderContents(userId, parent);
      if (response) {
        setfolders(response.subFolders);
        setimages(response.images);
        setParentName(response.name);
      }
    };
    fetch();
  }, [parent]);

  // Handle Adding Folder
  const handleAddFolder = async () => {
    const response = await addFolder(userId, parent, folderName);
    if (response) {
      setfolders(pre => [...pre, response]);
      setShowFolderPrompt(false);
      setFolderName("");
    }
  };

  // Handle Image Selection
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  // Handle Image Upload
  const handleUploadImage = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("userId", userId);
    formData.append("folderId", parent);

    try {
      const response = await uploadImage(formData);
      if (response) {
        setimages((prev) => [...prev, response]);
        setSelectedImage(null);
        setShowImageUploadPopup(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 relative bg-gray-50 min-h-screen text-gray-800">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-purple-600">Gallery:</span> {parentName}
        </h1>
      </div>

      {/* Folders Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Folders</h2>
          <button
            onClick={() => {
              setShowFolderPrompt(true);
              setShowOptions(false);
            }}
            className="flex items-center space-x-2 text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiFolderPlus className="text-base" />
            <span>New Folder</span>
          </button>
        </div>

        {folders.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <Link key={folder.id} to={`/user/home/${folder.id}`}>
                <div className="">
                  <Folder name={folder.name} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
            <FiFolderPlus className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500">No folders yet</p>
            <button
              onClick={() => setShowFolderPrompt(true)}
              className="mt-4 text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create your first folder
            </button>
          </div>
        )}
      </section>

      {/* Images Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Images</h2>
          <button
            onClick={() => {
              setShowImageUploadPopup(true);
              setShowOptions(false);
            }}
            className="flex items-center space-x-2 text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiImage className="text-base" />
            <span>Upload Image</span>
          </button>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {images.map((image, index) => (
              <ImageCard imageUrl={image} key={index} folderId={parent} setimages={setimages}/>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
            <FiImage className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500">No images yet</p>
            <button
              onClick={() => setShowImageUploadPopup(true)}
              className="mt-4 text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Upload your first image
            </button>
          </div>
        )}
      </section>

      {/* Image Upload Popup */}
      <AnimatePresence>
        {showImageUploadPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Upload Image</h3>
                  <button
                    onClick={() => setShowImageUploadPopup(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <label className="block mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="file-upload"
                    />
                    {selectedImage ? (
                      <div className="space-y-2">
                        <FaImage className="mx-auto text-3xl text-purple-500" />
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {selectedImage.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedImage.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <FaUpload className="mx-auto text-3xl text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Drag & drop your image here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500">
                          Supports: JPG, PNG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowImageUploadPopup(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadImage}
                    disabled={!selectedImage || isUploading}
                    className={`px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center ${(!selectedImage || isUploading) ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                  >
                    {isUploading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      'Upload Image'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folder Name Prompt */}
      <AnimatePresence>
        {showFolderPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Create New Folder</h3>
                  <button
                    onClick={() => setShowFolderPrompt(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter folder name"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowFolderPrompt(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFolder}
                    className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Create Folder
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;