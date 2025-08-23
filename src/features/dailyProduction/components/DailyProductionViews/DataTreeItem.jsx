import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const DataTreeItem = ({ data, children, defaultExpanded = false, dataId, className }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = children && React.Children.count(children) > 0;

  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg bg-white shadow-sm mb-2 ${className}`} data-id={dataId}>
      {/* Header with data and toggle button */}
      <div 
        className={`p-4 ${hasChildren ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
        onClick={toggleExpanded}
      >
        <div className="flex items-start justify-between">
          {/* Data presentation */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap w-fit">
                    {key}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 break-words">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Toggle icon */}
          {hasChildren && (
            <div className="ml-4 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors">
                {isExpanded ? (
                  <Minus className="w-4 h-4 text-blue-600" />
                ) : (
                  <Plus className="w-4 h-4 text-blue-600" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
          <div className="pt-4 space-y-2 ml-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};