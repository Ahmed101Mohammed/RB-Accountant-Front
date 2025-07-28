import React from "react";
import Details from "./Details.jsx";
const Textarea = ({ name, label, placeholder, onChange, value, disabled, listValues, onSelect, ref, style }) => {
  return (
    <div className="relative flex flex-col" ref={ref}>
      <label htmlFor={name} className="font-normal text-right">{label}</label>
      <textarea
        dir="rtl"
        name={name}
        id={name}
        placeholder={placeholder}
        className="max-h-10 border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 text-right focus:ring-blue-500"
        onChange={onChange}
        value={value}
        disabled={disabled}
        style={style}
      />

      {
        listValues && listValues.length
        ? <Details listValues={listValues} onSelect={onSelect} />
        : null
      }
    </div>
  );
};

export default Textarea