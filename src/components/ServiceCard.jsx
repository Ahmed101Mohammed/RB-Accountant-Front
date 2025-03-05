import React from "react";
const ServiceCard = ({ name, icon: Icon, description }) => {
  return (
    <div className="relative w-64 h-40 bg-gray-200 p-4 rounded-xl shadow-lg flex flex-col justify-center items-center text-center overflow-hidden">
      {Icon && typeof Icon === "function" && <Icon className="absolute opacity-10 w-full h-full inset-0" />}
      <h2 className="text-xl font-semibold z-10 relative">{name}</h2>
      <p className="text-sm text-gray-600 z-10 relative">{description}</p>
    </div>
  );
};

export default ServiceCard