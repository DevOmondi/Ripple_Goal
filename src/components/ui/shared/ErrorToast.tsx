import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface ErrorToastProps {
  message: string;
  details?: string;
  onClose: () => void;
  autoClose?: number;
  errorCode?: string | number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  message,
  details,
  onClose,
  autoClose = 5000,
  errorCode,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (autoClose) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(prev - 100 / (autoClose / 50), 0));
      }, 50);

      const timer = setTimeout(() => {
        onClose();
      }, autoClose);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [autoClose, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed top-6 right-6 z-50 w-80"
      >
        <div className="relative bg-white  border border-red-200 rounded-lg shadow-lg overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-red-500/50  w-full">
            <motion.div
              className="h-full bg-red-500 dark:bg-red-400"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: autoClose / 1000 }}
            />
          </div>

          {/* Toast content */}
          <div className="p-4 flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-500 " />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-medium text-red-500 ">{message}</h3>
                <button
                  onClick={onClose}
                  className="text-red-500  hover:text-red-600  transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {details && (
                <p className="mt-1 text-sm text-red-600">{details}</p>
              )}

              {errorCode && (
                <div className="mt-2 text-xs text-red-500  bg-red-100  px-2 py-1 rounded inline-block">
                  Error code: {errorCode}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorToast;
