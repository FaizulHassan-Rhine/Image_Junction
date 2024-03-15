
import React from 'react';
import { IoCloseCircleSharp } from "react-icons/io5";
const Modal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full h-[100px] relative flex justify-center items-center">
        <p className="text-sm text-teal-800 ">{message}</p>
        <button onClick={onClose} className="absolute top-1 right-1">
        <IoCloseCircleSharp className='text-red-500 text-xl' />
        </button>
      </div>
    </div>
  );
};

export default Modal;
