import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FaSpinner, 
  FaDownload, 
  FaTimes, 
  FaMicrophone, 
  FaMicrophoneSlash,
  FaImage
} from "react-icons/fa";
import { useSelector } from "react-redux";

const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const userId = useSelector((state) => state.userId);
  const rootFolderId = useSelector((state) => state.rootFolderId);
  const recognitionRef = useRef(null);
  const lastResultIndexRef = useRef(0);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const results = event.results;
        let newTranscripts = [];
        
        for (let i = lastResultIndexRef.current; i < results.length; i++) {
          const result = results[i];
          if (result.isFinal) {
            newTranscripts.push(result[0].transcript);
          }
        }
        
        lastResultIndexRef.current = results.length;
        
        if (newTranscripts.length > 0) {
          setPrompt(prev => `${prev} ${newTranscripts.join(' ')}`.trim());
        }
      };

      recognition.onerror = (event) => {
        setSpeechError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } else {
      setIsSpeechSupported(false);
      setSpeechError("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!isSpeechSupported) return;

    setSpeechError(null);
    lastResultIndexRef.current = 0;

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for the image");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            { text: prompt, weight: 1 },
            { text: "blurry, bad quality, distorted, disfigured, bad anatomy", weight: -1 }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const data = await response.json();
      
      if (data.artifacts?.[0]?.base64) {
        const imageUrl = `data:image/png;base64,${data.artifacts[0].base64}`;
        setGeneratedImage(imageUrl);
        await saveImageToGallery(imageUrl);
      } else {
        throw new Error("No image generated");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveImageToGallery = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `generated-${Date.now()}.png`, { type: 'image/png' });
      
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId);
      formData.append("folderId", rootFolderId);
      
      await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Save to gallery error:", err);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              AI Image Generator
            </span>
          </h1>
          <p className="text-gray-600">Transform your ideas into images using text or voice</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">Describe Your Vision</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {isRecording ? "Recording..." : "Click to speak"}
                </span>
                <button
                  onClick={toggleVoiceInput}
                  disabled={!isSpeechSupported || isGenerating}
                  className={`p-2 rounded-full transition-all ${
                    isRecording 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } ${!isSpeechSupported && "opacity-50 cursor-not-allowed"}`}
                >
                  {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: 'A majestic lion standing on a rocky cliff at sunset, digital art'"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[150px] pr-16 resize-none"
                disabled={isGenerating}
              />
              
              {prompt && (
                <button
                  onClick={() => setPrompt('')}
                  className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {(error || speechError) && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                {error || speechError}
              </div>
            )}

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateImage}
                disabled={isGenerating || !prompt.trim()}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isGenerating || !prompt.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isGenerating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaImage />
                    Create Image
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Generated Image</h2>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  <FaDownload />
                  Download
                </motion.button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img
                src={generatedImage}
                alt="Generated from text prompt"
                className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TextToImage;