import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { FC } from "react";
import Confetti from "react-confetti";

interface LogProgressButtonProps {
  onLog: (amount: number) => void;
}

const LogProgressButton: FC<LogProgressButtonProps> = ({ onLog }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [progressAmount, setProgressAmount] = useState<number>(1);

  const handleSubmit = () => {
    onLog(progressAmount);
    setIsOpen(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <>
      <AnimatePresence>
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-4 rounded-full shadow-xl z-10"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center">
          <span className="text-xl mr-2">+</span>
          <span className="font-medium">Log Progress</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-20"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-teal-700 mb-4">
                Log Your Progress
              </h3>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  How much progress did you make?
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 5].map((num) => (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      key={num}
                      className={`flex-1 py-3 rounded-xl ${
                        progressAmount === num
                          ? "bg-teal-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => setProgressAmount(num)}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-medium"
                onClick={handleSubmit}
              >
                Add Progress
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LogProgressButton;
