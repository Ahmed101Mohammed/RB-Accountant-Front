import React, { useState } from 'react';

const SingleCardDataDisplay = ({ data, style }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div dir='rtl' className="w-full bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 p-2" style={style}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div 
            key={key} 
            className={`overflow-hidden bg-gray-50 p-4 rounded-lg border border-gray-200`}
          >
            <span className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">{key}</span>
            <span className="block text-lg font-semibold text-gray-800 break-words">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleCardDataDisplay;