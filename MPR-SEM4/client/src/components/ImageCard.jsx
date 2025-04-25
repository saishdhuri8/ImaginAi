import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, Maximize2, Trash2 } from "lucide-react";
import ImageEditor from "./ImageEditor";
import { deleteImage } from "../API/user.api";
import { useSelector } from 'react-redux';

const ImageCard = ({ imageUrl, folderId, setimages }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [disableHover, setDisableHover] = useState(false);
  const [edit, setEdit] = useState(false);
  const userId = useSelector(state => state.userId);

  const toggleFullScreen = () => {
    if (isFullScreen) {
      setDisableHover(true);
      setTimeout(() => setDisableHover(false), 300);
    }
    setIsFullScreen((prev) => !prev);
  };

  const toggleEdit = () => setEdit((prev) => !prev);
  const closeEditor = () => setEdit(false);

  const handleDelete = () => {
    const data = {
      userId: userId,
      folderId: folderId,
      imageURL: imageUrl
    }
    const response = deleteImage(data);
    if (response) {
      setimages(pre => pre.filter((img) => img !== imageUrl));
      setIsFullScreen(false);
    }

  
  };

  return (
    <>
      {/* Main Image Card */}
      <div className="relative w-full max-w-sm group">
        <div
          onClick={toggleFullScreen}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg transition-all duration-300 cursor-zoom-in${!isFullScreen && !disableHover && "group-hover:shadow-xl"
            }`}
        >
          <motion.img
            src={imageUrl}
            alt="Display"
            className="w-full h-60 object-cover transition-opacity duration-300 group-hover:opacity-90"
            whileHover={!isFullScreen && !disableHover ? { scale: 1.02 } : {}}
            transition={{ duration: 0.3 }}
          />

          {/* Hover Overlay Expand Button */}
          {!isFullScreen && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
              <div className="flex items-center gap-2 bg-white/90 text-gray-800 px-4 py-2 rounded-full shadow-md text-sm font-medium">
                <Maximize2 size={16} />
                Expand
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleFullScreen}
          >
            {/* Top Control Bar */}
            <div className="absolute top-0 left-0 right-0 flex justify-end items-center gap-3 p-4 z-10">
              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleEdit();
                }}
                className="p-2 bg-white/10 backdrop-blur-lg rounded-full hover:bg-white/20 transition-colors"
                aria-label="Edit image"
              >
                <Edit2 size={20} className="text-white" />
              </button>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-2 bg-red-500/20 backdrop-blur-lg rounded-full hover:bg-red-500/40 transition-colors"
                aria-label="Delete image"
              >
                <Trash2 size={20} className="text-red-400" />
              </button>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullScreen();
                }}
                className="p-2 bg-white/10 backdrop-blur-lg rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Centered Image */}
            <div className="flex-1 flex items-center justify-center p-4">
              <motion.img
                src={imageUrl}
                alt="Full Screen"
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Bottom Hint */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm">
              Click anywhere to exit
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Editor Popup */}
      {edit && (
        <div className="fixed inset-0 z-[99999]">
          <ImageEditor imageUrl={imageUrl} onClose={closeEditor} />
        </div>
      )}
    </>
  );
};

export default ImageCard;
