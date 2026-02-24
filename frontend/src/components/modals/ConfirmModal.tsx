// frontend/src/components/modals/ConfirmModal.tsx

import React from "react";
import ReactDOM from "react-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isConfirming?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  isConfirming = false,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <div className="relative w-auto max-w-lg mx-auto my-6">
        {/* Modal content */}
        <div className="relative flex flex-col w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 dark:border-gray-700 rounded-t">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-500 dark:text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="text-gray-500 dark:text-gray-400 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          {/* Body */}
          <div className="relative p-6 flex-auto">
            <p className="my-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{message}</p>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 dark:border-gray-700 rounded-b">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={onClose}
              disabled={isConfirming}
            >
              {cancelButtonText}
            </button>
            <button
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={onConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? "..." : confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body // Portal to document.body
  );
};
