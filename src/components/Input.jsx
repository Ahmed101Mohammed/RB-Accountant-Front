import React from "react";
import Details from "./Details.jsx";
export const Input = ({ type, name, label, step, placeholder, onChange, value, disabled, listValues, onSelect, ref, inputRef }) => {
  return (
    <div className="relative flex flex-col" ref={ref}>
      <label htmlFor={name} className="font-normal text-right">{label}</label>
      <input
        ref={inputRef}
        dir="rtl"
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 text-right focus:ring-blue-500"
        onChange={onChange}
        value={value}
        disabled={disabled}
        step={step
          ? step
          : "1"
        }
      />

      {
        listValues && listValues.length
        ? <Details listValues={listValues} onSelect={onSelect} />
        : null
      }
    </div>
  );
};