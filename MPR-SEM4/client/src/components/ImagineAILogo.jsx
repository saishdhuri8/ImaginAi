import React from 'react';

const ImagineAILogo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      {/* Main logo container */}
      <div className="relative w-full h-full">
        {/* Purple gradient circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg"></div>
        
        {/* AI symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Letter A */}
            <div className="absolute -left-6 -top-4 w-12 h-16 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
            <div className="absolute -left-6 top-4 w-12 h-1 bg-white"></div>
            
            {/* Letter I */}
            <div className="absolute right-2 -top-4 w-4 h-20 bg-white rounded-full"></div>
            <div className="absolute right-0 -top-6 w-8 h-4 bg-white rounded-full"></div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 bg-purple-400 blur-md"></div>
      </div>
      
      {/* Text logo */}
      <div className="absolute -bottom-10 w-full text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          ImagineAI
        </h1>
      </div>
    </div>
  );
};

export default ImagineAILogo;