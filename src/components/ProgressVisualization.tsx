import { motion } from "framer-motion";
import type { FC } from "react";

interface ProgressData {
  current: number;
  target: number;
  unit?: string;
  goal?: string;
  cause?: string;
  emoji?: string;
  nextUnlock?: string;
}

interface ProgressVisualizationProps {
  progress: ProgressData;
  isPersonal: boolean;
}

const ProgressVisualization: FC<ProgressVisualizationProps> = ({
  progress,
  isPersonal,
}) => {
  const percentage = Math.min(100, (progress.current / progress.target) * 100);
  const gradient = isPersonal
    ? "from-teal-400 to-emerald-500"
    : "from-amber-400 to-orange-500";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
    >
      <h3 className="font-bold text-lg mb-4 flex items-center">
        <span
          className={`mr-2 ${isPersonal ? "text-teal-600" : "text-amber-600"}`}
        >
          {isPersonal ? "🌟 Your Progress" : "🌍 Community Momentum"}
        </span>
      </h3>

      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium text-gray-600">
          {isPersonal ? progress.goal : progress.cause}
        </span>
        <span className="font-semibold">
          {progress.current}
          {progress.unit ? ` ${progress.unit}` : ""} / {progress.target}
        </span>
      </div>

      <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
        />
      </div>

      {!isPersonal && progress.nextUnlock && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100"
        >
          <p className="text-sm text-amber-800">
            <span className="font-medium">Next Unlock:</span>{" "}
            {progress.nextUnlock}
          </p>
        </motion.div>
      )}

      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="mt-4 text-center"
      >
        <span className="text-4xl">
          {isPersonal
            ? percentage < 30
              ? "🌱"
              : percentage < 70
              ? "🌿"
              : "🌳"
            : percentage < 30
            ? "💧"
            : percentage < 70
            ? "🌊"
            : "🌎"}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default ProgressVisualization;
