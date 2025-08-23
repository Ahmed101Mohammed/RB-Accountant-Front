import React from "react";

export const SelectInput = ({ value, onChange, options, label, icon: Icon, placeholder = "اختر", className = '', onFocus }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {Icon && <Icon size={16} />}
      {label}
    </label>
    <select
      value={value || ''}
      onFocus={onFocus}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    >
      <option value="" disabled hidden>{placeholder}</option>
      {options.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);