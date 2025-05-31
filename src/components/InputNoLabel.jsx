import React, { useState } from "react";
import Details from "./Details.jsx";
const InputNoLabel = ({ type, name, step, placeholder, onChange, value, disabled, listValues, onSelect, ref }) => {
  const [isVisible, setVisibility] = useState(true)

  return (
    <div className="relative flex flex-col" ref={ref}>
      <input
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
        min="0"
      />

      {
        listValues && listValues.length && isVisible
        ? <Details listValues={listValues} onSelect={onSelect} style={{marginTop: '0px', zIndex: '10'}}/>
        : null
      }
    </div>
  );
};

export default InputNoLabel