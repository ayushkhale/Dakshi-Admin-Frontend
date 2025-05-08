import React from "react";

const CustomModal = ({ isOpen, onClose, title, message, type }) => {
  if (!isOpen) return null; 
  const getColor = () => {
    switch (type) {
      case "error":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xs w-96 relative">
        <div className={`text-white p-3  ${getColor()} text-center font-bold text-lg`}>
          {title}
        </div>
        <div className="p-4 text-center text-gray-800">{message}</div>
        <div className="flex justify-center">
          <button
            className={`px-4 py-2 mb-5 rounded-lg text-white ${getColor()} hover:opacity-80`}
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
