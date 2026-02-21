// frontend/src/components/toast/ToastProvider.tsx
import React, { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // in milliseconds, default to 3000
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = ToastType.INFO, duration: number = 3000) => {
    const id = Math.random().toString(36).substring(2, 9); // Simple unique ID
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    if (toasts.length > 0) {
      const currentToast = toasts[0];
      if (currentToast) { // Add an explicit check for currentToast
        const timer = setTimeout(() => {
          removeToast(currentToast.id);
        }, currentToast.duration);
        return () => clearTimeout(timer);
      }
    }
  }, [toasts, removeToast]);

  const getToastClasses = (type: ToastType) => {
    switch (type) {
      case ToastType.SUCCESS:
        return 'bg-green-500';
      case ToastType.ERROR:
        return 'bg-red-500';
      case ToastType.INFO:
        return 'bg-blue-500';
      case ToastType.WARNING:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`${getToastClasses(toast.type)} text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-between transition-all duration-300 transform translate-y-0 opacity-100`}
            >
              <span>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="ml-4 text-white font-bold">
                &times;
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
