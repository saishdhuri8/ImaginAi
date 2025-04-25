import React, { useEffect, useState } from "react";
import { X, Loader2, Download, Wand2, Sliders, ChevronLeft } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Load from "./Loader/Load";

const FILTERS = [
    { name: "Grayscale", value: "e_grayscale" },
    { name: "Sepia", value: "e_sepia" },
    { name: "Invert", value: "e_negate" },
    { name: "Blur", value: "e_blur:200" },
    { name: "Brightness", value: "e_brightness:50" },
    { name: "Contrast", value: "e_contrast:50" },
];

const AI_FEATURES = [
    { name: "Background Remove", value: "e_background_removal" },
    { name: "Generative Restore", value: "e_gen_restore" },
];

const AI_PRO_FEATURES = [
    { name: "BackGround Replace", value: "e_gen_background_replace" },
];

const ImageEditor = ({ imageUrl, onClose }) => {
    const [selectedFilter, setSelectedFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [editedUrl, setEditedUrl] = useState(imageUrl);
    const [mode, setMode] = useState("normal");
    const [showControls, setShowControls] = useState(true);
    const [prompt, setprompt] = useState("");
    const [aipro, setaipro] = useState("");

    useEffect(() => {
        setEditedUrl(imageUrl);
        setaipro("");
        setprompt("");
    }, [mode]);

    const applyFilter = async (filter) => {
        setLoading(true);
        setSelectedFilter(filter);
        const [base, params] = imageUrl.split("/upload/");
        const editedImageUrl = `${base}/upload/${filter}/${params}`;

        try {
            const res = await axios.get(editedImageUrl);
            if (res.status === 200) {
                setEditedUrl(editedImageUrl);
            }
        } catch (error) {
            console.error("Failed to apply filter:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyAIFeature = async (aiFeature) => {
        setLoading(true);
        const [base, params] = imageUrl.split("/upload/");
        const aiImageUrl = `${base}/upload/${aiFeature}/${params}`;

        let count = 0;
        const maxAttempts = 20;

        const ai_interval = setInterval(async () => {
            try {
                const res = await axios.get(aiImageUrl);
                if (res.status === 200) {
                    clearInterval(ai_interval);
                    setEditedUrl(aiImageUrl);
                    setLoading(false);
                }
            } catch (error) {
                if (error.response?.status === 403) {
                    console.log(`Attempt ${count + 1}: Retrying...`);
                }
            }

            if (++count >= maxAttempts) {
                clearInterval(ai_interval);
                setLoading(false);
            }
        }, 3000);
    };
    

    const downloadImage = async () => {
        try {
            const response = await axios.get(editedUrl, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "edited-image.jpg");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    const applyBackgroundReplace = async () => {
        if (prompt.length == 0 || aipro !== "BackGround Replace") return;
        setLoading(true);
        const [base, params] = imageUrl.split("/upload/");
        let finalPrompt = prompt.trim().replaceAll(/\s+/g, ' ').replaceAll(' ', "%20");
        const aiImageUrl = `${base}/upload/${AI_PRO_FEATURES[0].value}:prompt_${finalPrompt}/${params}`;

        let count = 0;
        const maxAttempts = 20;

        const ai_interval = setInterval(async () => {
            try {
                const res = await axios.get(aiImageUrl);
                if (res.status === 200) {
                    clearInterval(ai_interval);
                    setEditedUrl(aiImageUrl);
                    setLoading(false);
                }
            } catch (error) {
                if (error.response?.status === 403) {
                    console.log(`Attempt ${count + 1}: Retrying...`);
                }
            }

            if (++count >= maxAttempts) {
                clearInterval(ai_interval);
                setLoading(false);
            }
        }, 5000);
    };

    const handleBackgroundReplace = () => {
        setaipro(AI_PRO_FEATURES[0].name);
        setEditedUrl(imageUrl);
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-gray-900/95 z-[9999] flex flex-col lg:flex-row overflow-y-auto hide-scrollbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-700">
                    <button
                        onClick={() => setShowControls(!showControls)}
                        className="text-white p-2 rounded-full hover:bg-gray-700"
                    >
                        <ChevronLeft size={20} className={`transition-transform ${showControls ? 'rotate-0' : 'rotate-180'}`} />
                    </button>
                    <h2 className="text-lg font-bold text-white">Image Editor</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Left Panel - Controls (Responsive) */}
                {showControls && (
                    <motion.div
                        className="w-full lg:w-80 bg-gray-800/80 lg:border-r border-gray-700 p-4 lg:p-6 flex flex-col"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="hidden lg:flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Image Editor</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex gap-2 mb-6 bg-gray-700 p-1 rounded-lg">
                            <button
                                onClick={() => setMode("normal")}
                                className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ${mode === "normal" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-600"}`}
                            >
                                <Sliders size={16} />
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                            <button
                                onClick={() => setMode("ai")}
                                className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ${mode === "ai" ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-gray-600"}`}
                            >
                                <Wand2 size={16} />
                                <span className="hidden sm:inline">AI Tools</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                                {mode === "normal" ? "FILTERS" : "AI FEATURES"}
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {(mode === "normal" ? FILTERS : AI_FEATURES).map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => {
                                            mode === "normal" ? applyFilter(item.value) : applyAIFeature(item.value);
                                            setaipro("");
                                            setprompt("");
                                        }}
                                        className={`p-3 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${selectedFilter === item.value ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-200"}`}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {mode !== "normal" && (
                            <div className="flex-1 overflow-y-auto">
                                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                                    AI Pro
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={handleBackgroundReplace}
                                        className="p-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all duration-300
                                            bg-gradient-to-r from-purple-600 to-purple-800 text-white
                                            border border-purple-400
                                            shadow-[0_0_10px_2px_rgba(168,85,247,0.6)]
                                            hover:shadow-[0_0_15px_5px_rgba(168,85,247,0.8)]
                                            hover:brightness-110
                                            active:scale-95
                                            relative overflow-hidden
                                            before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,_rgba(192,132,252,0.4)_0%,_transparent_70%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                                    >
                                        <span className="relative z-10 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
                                            Background Replace
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {(aipro === "BackGround Replace" && mode !== "normal") && (
                            <div className="relative flex flex-col gap-2 mt-4">
                                <textarea
                                    className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows="3"
                                    placeholder="Describe the background you want to generate..."
                                    onChange={(e) => { setprompt(e.target.value) }}
                                ></textarea>
                                <button
                                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center gap-2 text-sm transition-all duration-200"
                                    onClick={applyBackgroundReplace}
                                >
                                    <span>Generate</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <button
                            onClick={downloadImage}
                            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm sm:text-base"
                        >
                            <Download size={18} />
                            <span>Download Image</span>
                        </button>
                    </motion.div>
                )}

                {/* Right Panel - Image Preview */}
                <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
                            <Load />
                        </div>
                    )}

                    {!showControls && (
                        <button
                            onClick={() => setShowControls(true)}
                            className="absolute top-4 left-4 z-20 bg-gray-800/80 text-white p-2 rounded-full hover:bg-gray-700"
                        >
                            <Sliders size={20} />
                        </button>
                    )}

                    <div className="w-full h-full max-w-full bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 lg:max-h-[90vh] max-h-[calc(100vh-200px)]">
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                            <img
                                src={editedUrl}
                                alt="Edited Preview"
                                className="max-w-full max-h-full object-contain"
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: '100%'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageEditor;
