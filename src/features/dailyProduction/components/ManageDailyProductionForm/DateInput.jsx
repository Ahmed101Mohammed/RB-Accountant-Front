import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

export const DateInput = ({ value, onChange, label, className = '', disabled }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Calendar size={16} />
      {label}
    </label>
    <input
      type="date"
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    />
  </div>
);
