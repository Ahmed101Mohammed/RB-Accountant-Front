import React from "react";
const SelectNoLabel = ({ name, options, onChange, value }) => {
  return (
    <select
      name={name}
      id={name}
      className="w-full [border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 text-right focus:ring-blue-500"
      onChange={onChange}
      value={value}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default SelectNoLabel