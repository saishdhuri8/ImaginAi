import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaDownload, FaUpload, FaTimes } from "react-icons/fa";
import { FiImage, FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";

const PromptToEdit = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const userId = useSelector((state) => state.userId);
  const rootFolderId = useSelector((state) => state.rootFolderId);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setOriginalImage(file);
      setEditedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEditImage = async () => {
    if (!originalImage) {
      setError("Please upload an image first");
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // Convert the image to base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Get the full data URL
          resolve(reader.result);
        };
        reader.readAsDataURL(originalImage);
      });

      // Call Replicate API directly
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${process.env.VITE_REPLICATE_API_TOKEN}`,
        },
        body: JSON.stringify({
          version: "c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
          input: {
            image: base64Image,
            prompt: prompt,
            negative_prompt: "blurry, bad quality, distorted, disfigured, bad anatomy, bad proportions",
            num_inference_steps: 20,
            guidance_scale: 7.5,
            strength: 0.5
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error details:", errorData);
        throw new Error(`API error: ${response.status} - ${errorData.error || errorData.detail || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Poll for the result
      const result = await pollForResult(data.id);
      
      if (result && result.output && result.output.length > 0) {
        setEditedImage(result.output[0]);
        
        // Save the image to the user's gallery
        await saveImageToGallery(result.output[0]);
      } else {
        throw new Error("No image generated");
      }
    } catch (err) {
      console.error("Error editing image:", err);
      setError("Failed to edit image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const pollForResult = async (predictionId) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          "Authorization": `Token ${process.env.VITE_REPLICATE_API_TOKEN}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "succeeded") {
        return data;
      } else if (data.status === "failed") {
        throw new Error("Image editing failed");
      }
      
      // Wait for 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    
    throw new Error("Timeout waiting for image editing result");
  };

  const saveImageToGallery = async (imageUrl) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a file from the blob
      const file = new File([blob], `edited-${Date.now()}.png`, { type: 'image/png' });
      
      // Create FormData
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId);
      formData.append("folderId", rootFolderId);
      
      // Upload to your API
      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        console.error("Failed to save image to gallery");
      }
    } catch (err) {
      console.error("Error saving image to gallery:", err);
    }
  };

  const handleDownload = () => {
    if (!editedImage) return;
    
    // Create a link element
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `edited-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-6 relative bg-gray-50 min-h-screen text-gray-800">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-purple-600">Prompt to Edit</span> Image
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Image Upload Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload an Image</h2>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          {!previewUrl ? (
            <div 
              onClick={triggerFileInput}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
            >
              <FiUpload className="mx-auto text-3xl text-gray-400 mb-3" />
              <p className="text-sm text-gray-600">
                Drag & drop your image here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Supports: JPG, PNG, GIF up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Original"
                className="max-w-full rounded-lg shadow-md mx-auto"
              />
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setOriginalImage(null);
                  setEditedImage(null);
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter Your Edit Prompt</h2>
          <div className="mb-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want to edit the image..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
              disabled={isGenerating || !originalImage}
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEditImage}
              disabled={isGenerating || !prompt.trim() || !originalImage}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium ${
                isGenerating || !prompt.trim() || !originalImage
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Editing...</span>
                </>
              ) : (
                <>
                  <FiImage />
                  <span>Edit Image</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Edited Image Display */}
        {editedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Edited Image</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                <FaDownload />
                <span>Download</span>
              </motion.button>
            </div>
            
            <div className="flex justify-center">
              <img
                src={editedImage}
                alt="Edited from prompt"
                className="max-w-full rounded-lg shadow-md"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PromptToEdit; 