import React from "react";
import Details from "../../../../components/Details.jsx";

export const TextInput = ({ value, onChange, label, icon: Icon, placeholder = '', className = '', listValues=[], onSelect, onFocus }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {Icon && <Icon size={16} />}
      {label}
    </label>
    <input
      dir="rtl"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    />

    {
      listValues && listValues.length
      ? <Details listValues={listValues} onSelect={onSelect} />
      : null
    }
  </div>
);