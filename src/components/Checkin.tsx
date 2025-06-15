import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { FC } from "react";
import Confetti from "react-confetti";
import axios from "axios";
import type { Goal } from "../../types/goalTypes";

interface CheckinProps {
  userId: string;
  goals: Goal[];
  onCheckinSuccess: () => void;
}

const Checkin: FC<CheckinProps> = ({ userId, goals, onCheckinSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [progressAmount, setProgressAmount] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleGoalSelect = (goalId: string) => {
    const goal = goals.find((g) => g.id === Number(goalId)) || null;
    setSelectedGoal(goal);
    // Reset progress amount when goal changes
    setProgressAmount(1);
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 0;
    const max = selectedGoal?.frequencyUnit === "days" ? 7 : 100;
    value = Math.max(1, Math.min(value, max));
    setProgressAmount(value);
  };

  const handleIncrement = () => {
    const max = selectedGoal?.frequencyUnit === "days" ? 7 : 100;
    setProgressAmount((prev) => Math.min(prev + 1, max));
  };

  const handleDecrement = () => {
    setProgressAmount((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!selectedGoal) return;

    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/checkins/create-checkin`,
        {
          goalId: selectedGoal.id,
          value: progressAmount,
          notes,
          userId,
        }
      );

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setIsOpen(false);
      onCheckinSuccess();
    } catch (error) {
      console.error("Error logging progress:", error);
    } finally {
      setIsLoading(false);
    }
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
          <span className="font-medium">Checkin</span>
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
                You are doing great!!
              </h3>

              {/* Goal Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Goal</label>
                <select
                  value={selectedGoal?.id || ""}
                  onChange={(e) => handleGoalSelect(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">Select a goal</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title} ({goal.targetFrequency} {goal.frequencyUnit}
                      /week)
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress Input - Dynamic based on frequency unit */}
              {selectedGoal && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Progress Amount ({selectedGoal.frequencyUnit})
                  </label>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg"
                      onClick={handleDecrement}
                    >
                      -
                    </motion.button>

                    <input
                      type="number"
                      min="1"
                      max={selectedGoal.frequencyUnit === "days" ? 7 : 100}
                      value={progressAmount}
                      onChange={handleNumberInput}
                      className="flex-1 p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg"
                      onClick={handleIncrement}
                      disabled={
                        selectedGoal.frequencyUnit === "days" &&
                        progressAmount >= 7
                      }
                    >
                      +
                    </motion.button>
                  </div>
                  {selectedGoal.frequencyUnit === "days" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Max 7 days per week
                    </p>
                  )}
                </div>
              )}

              {/* Notes Field */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  rows={3}
                  placeholder="Any details about your progress..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={!selectedGoal || isLoading}
                className={`w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-medium ${
                  !selectedGoal || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Checkin"
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Checkin;
