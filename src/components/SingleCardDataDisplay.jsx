import React, { useState } from 'react';

const SingleCardDataDisplay = ({ data, title, style }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Handle empty data case
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="ml-[286px] min-w-[calc(100% - 286px)  bg-white rounded-xl shadow-lg p-2 border">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-100">{title || 'No Title'}</h2>
        <p className="text-gray-400 italic text-base">No data available</p>
      </div>
    );
  }

  return (
    <div dir='rtl' className=" ml-[286px] min-w-[calc(100% - 286px) bg-white rounded-xl shadow-lg p-2 border border-gray-100 transition-all duration-300]" style={style}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-100">{title || null}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div 
            key={key} 
            className={`relative overflow-hidden bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-200 ${hoveredItem === key ? 'transform -translate-y-1 shadow-md' : ''}`}
            onMouseEnter={() => setHoveredItem(key)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
            <span className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">{key}</span>
            <span className="block text-lg font-semibold text-gray-800 break-words">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleCardDataDisplay;