// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, CheckCircle } from 'lucide-react';

// interface SuccessToastProps {
//   message: string;
//   details?: string;
//   onClose: () => void;
//   autoClose?: number;
//   successCode?: string | number;
// }

// const SuccessToast: React.FC<SuccessToastProps> = ({
//   message,
//   details,
//   onClose,
//   autoClose = 5000,
//   successCode,
// }) => {
//   const [progress, setProgress] = useState(100);

//   useEffect(() => {
//     if (autoClose) {
//       const interval = setInterval(() => {
//         setProgress((prev) => Math.max(prev - 100 / (autoClose / 50), 0));
//       }, 50);

//       const timer = setTimeout(() => {
//         onClose();
//       }, autoClose);

//       return () => {
//         clearInterval(interval);
//         clearTimeout(timer);
//       };
//     }
//   }, [autoClose, onClose]);

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: 20, scale: 0.95 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, y: -20, scale: 0.95 }}
//         transition={{ type: 'spring', damping: 20, stiffness: 300 }}
//         className="fixed top-6 right-6 z-50 w-80"
//       >
//         <div className="relative bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg overflow-hidden">
//           {/* Progress bar */}
//           <div className="absolute top-0 left-0 h-1 bg-green-500/50 dark:bg-green-400/50 w-full">
//             <motion.div
//               className="h-full bg-green-500 dark:bg-green-400"
//               initial={{ width: '100%' }}
//               animate={{ width: `${progress}%` }}
//               transition={{ duration: autoClose / 1000 }}
//             />
//           </div>

//           {/* Toast content */}
//           <div className="p-4 flex items-start gap-3">
//             <div className="flex-shrink-0 pt-0.5">
//               <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
//             </div>

//             <div className="flex-1 min-w-0">
//               <div className="flex justify-between items-start gap-2">
//                 <h3 className="font-medium text-green-800 dark:text-green-100">
//                   {message}
//                 </h3>
//                 <button
//                   onClick={onClose}
//                   className="text-green-400 dark:text-green-300 hover:text-green-500 dark:hover:text-green-200 transition-colors"
//                   aria-label="Close"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>

//               {details && (
//                 <p className="mt-1 text-sm text-green-600 dark:text-green-300">
//                   {details}
//                 </p>
//               )}

//               {successCode && (
//                 <div className="mt-2 text-xs text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded inline-block">
//                   Success code: {successCode}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default SuccessToast;

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

interface SuccessToastProps {
  message: string;
  details?: string;
  onClose: () => void;
  autoClose?: number;
  successCode?: string | number;
}

const SuccessToast: React.FC<SuccessToastProps> = ({
  message,
  details,
  onClose,
  autoClose = 5000,
  successCode,
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
        <div className="relative bg-white  border border-teal-200  rounded-lg shadow-lg overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-teal-500/50  w-full">
            <motion.div
              className="h-full bg-teal-500"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: autoClose / 1000 }}
            />
          </div>

          {/* Toast content */}
          <div className="p-4 flex items-start gap-3">
            <div className="flex-shrink-0 pt-0.5">
              <CheckCircle className="w-5 h-5 text-teal-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-medium text-teal-800">
                  {message}
                </h3>
                <button
                  onClick={onClose}
                  className="text-teal-400 hover:text-teal-500  transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {details && (
                <p className="mt-1 text-sm text-teal-600">{details}</p>
              )}

              {successCode && (
                <div className="mt-2 text-xs text-teal-500 dark:text-emerald-400 bg-teal-100 dark:bg-emerald-900/30 px-2 py-1 rounded inline-block">
                  Success code: {successCode}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessToast;
