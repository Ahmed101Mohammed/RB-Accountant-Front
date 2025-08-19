import React from "react";

export const NumberInput = ({ value, onChange, label, className = '', onFocus }) => (
  <div className={`space-y-2`}>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type="number"
      min="0"
      step="1"
      value={value}
      onFocus={onFocus}
      dir="rtl"
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
    />
  </div>
);