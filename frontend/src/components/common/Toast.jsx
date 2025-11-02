import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ 
  type = 'info', 
  message, 
  duration = 5000, 
  onClose,
  position = 'top-right'
}) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
    error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
    warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700',
    info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
  };

  const textColors = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    info: 'text-blue-800 dark:text-blue-200',
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div 
      className={`fixed ${positions[position]} z-50 animate-slide-in`}
      role="alert"
    >
      <div className={`${bgColors[type]} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${textColors[type]}`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${textColors[type]} hover:opacity-75 transition-opacity`}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;

// Toast Container Component (for managing multiple toasts)
export const ToastContainer = ({ toasts = [], removeToast }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Custom hook for managing toasts
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message) => {
    addToast({ type: 'success', message });
  }, [addToast]);

  const showError = useCallback((message) => {
    addToast({ type: 'error', message });
  }, [addToast]);

  const showWarning = useCallback((message) => {
    addToast({ type: 'warning', message });
  }, [addToast]);

  const showInfo = useCallback((message) => {
    addToast({ type: 'info', message });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
