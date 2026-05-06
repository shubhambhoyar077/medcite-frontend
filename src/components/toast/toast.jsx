/**
 * Simple Toast Hook with Container Component
 * 
 * 1. Add <ToastContainer /> once in your layout (after topbar)
 * 2. Use toast.success(), toast.error(), etc. anywhere in your app
 * Ex:- <ToastContainer position="top-right" />
 * 
 * // In any component:
 * import toast from './useToast';
 * 
 * function MyComponent() {
 *   const handleSave = () => {
 *     toast.success('Saved successfully!');
 *   };
 *   
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * 
 * // Available methods:
 * toast.success('Message');
 * toast.error('Message');
 * toast.warning('Message');
 * toast.info('Message');
 * 
 * // With options:
 * toast.success('Message', { 
 *   duration: 3000,
 *   position: 'top-right',
 *   title: 'Success',
 *   action: { label: 'Undo', onClick: handleUndo }
 * });
 * 
 * // For async operations:
 * toast.promise(
 *   saveData(),
 *   {
 *     loading: 'Saving...',
 *     success: 'Saved!',
 *     error: 'Failed to save'
 *   }
 * );
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Global state
let globalToasts = [];
let listeners = [];

const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const notify = () => {
  listeners.forEach((listener) => listener([...globalToasts]));
};

const addToast = (toast) => {
  const id = Date.now() + Math.random();
  const newToast = { 
    id, 
    position: 'top-right',
    duration: 4000,
    ...toast 
  };
  
  globalToasts = [...globalToasts, newToast];
  notify();
  
  if (newToast.duration !== Infinity) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }
  
  return id;
};

const removeToast = (id) => {
  globalToasts = globalToasts.filter((toast) => toast.id !== id);
  notify();
};

const updateToast = (id, updates) => {
  globalToasts = globalToasts.map((toast) =>
    toast.id === id ? { ...toast, ...updates } : toast
  );
  notify();
};

// Toast Item Component
const ToastItem = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const typeConfig = {
    success: {
      icon: <CheckCircle size={20} />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: <XCircle size={20} />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: <AlertCircle size={20} />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: <Info size={20} />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg max-w-md w-full transition-all duration-300 ${
        config.bgColor
      } ${config.borderColor} ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
      style={{
        animation: isExiting ? 'none' : 'slideIn 0.3s ease-out'
      }}
    >
      <div className={`flex-shrink-0 ${config.iconColor}`}>
        {toast.icon || config.icon}
      </div>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className={`font-semibold text-sm mb-1 ${config.textColor}`}>
            {toast.title}
          </h4>
        )}
        <p className={`text-sm ${config.textColor}`}>{toast.message}</p>
        
        {toast.action && (
          <button
            onClick={() => {
              toast.action.onClick();
              handleRemove();
            }}
            className={`mt-2 text-sm font-medium underline ${config.textColor} hover:no-underline`}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleRemove}
        className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
      >
        <X size={18} />
      </button>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ position = 'top-right' }) => {
  const [toasts, setToasts] = useState(globalToasts);

  useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return unsubscribe;
  }, []);

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const pos = toast.position || position;
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(toast);
    return acc;
  }, {});

  const positionClasses = {
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
    'top-center': 'top-20 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      {Object.entries(toastsByPosition).map(([pos, positionToasts]) => (
        <div
          key={pos}
          className={`fixed ${positionClasses[pos]} z-50 flex flex-col gap-2`}
        >
          {positionToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      ))}
    </>
  );
};

// Toast API
const toast = {
  success: (message, options = {}) => {
    return addToast({
      type: 'success',
      message,
      ...options
    });
  },

  error: (message, options = {}) => {
    return addToast({
      type: 'error',
      message,
      ...options
    });
  },

  warning: (message, options = {}) => {
    return addToast({
      type: 'warning',
      message,
      ...options
    });
  },

  info: (message, options = {}) => {
    return addToast({
      type: 'info',
      message,
      ...options
    });
  },

  custom: (options) => {
    return addToast(options);
  },

  promise: (promise, messages) => {
    const id = addToast({
      type: 'info',
      message: messages.loading || 'Loading...',
      duration: Infinity
    });

    promise
      .then((result) => {
        updateToast(id, {
          type: 'success',
          message: messages.success || 'Success!',
          duration: 4000
        });
        setTimeout(() => removeToast(id), 4000);
        return result;
      })
      .catch((error) => {
        updateToast(id, {
          type: 'error',
          message: messages.error || 'Error occurred',
          duration: 4000
        });
        setTimeout(() => removeToast(id), 4000);
        throw error;
      });

    return promise;
  },

  dismiss: (id) => {
    removeToast(id);
  }
};

export default toast;