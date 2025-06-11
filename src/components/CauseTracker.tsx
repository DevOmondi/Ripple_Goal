import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { FC } from "react";

interface Progress {
  current: number;
  target: number;
  cause: string;
  nextUnlock?: string;
}

interface Milestone {
  target: number;
  unlock: string;
}

interface CauseTrackerProps {
  progress: Progress;
}

const CauseTracker: FC<CauseTrackerProps> = ({ progress }) => {
  const [expanded, setExpanded] = useState(false);
  const percentage = Math.min(100, (progress.current / progress.target) * 100);

  const milestones: Milestone[] = [
    { target: 10000, unlock: "Plant 100 trees in urban areas" },
    { target: 25000, unlock: "Fund a community garden" },
    { target: 50000, unlock: "Sponsor a forest restoration project" },
  ];

  return (
    <motion.div
      layout
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg overflow-hidden"
    >
      <motion.div layout className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg flex items-center">
          <span className="text-amber-600 mr-2">🌍</span>
          {progress.cause}
        </h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(!expanded)}
          className="text-amber-600"
        >
          {expanded ? "▲" : "▼"}
        </motion.button>
      </motion.div>

      <motion.div layout className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Community Progress</span>
          <span>
            {progress.current.toLocaleString()} /{" "}
            {progress.target.toLocaleString()}
          </span>
        </div>
        <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="space-y-4"
          >
            <div className="border-t border-amber-100 pt-4">
              <h4 className="font-semibold text-amber-700 mb-3">
                Upcoming Milestones
              </h4>
              <div className="space-y-3">
                {milestones.map((milestone, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 5 }}
                    className={`flex items-start p-3 rounded-lg ${
                      progress.current >= milestone.target
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-lg mr-3 ${
                        progress.current >= milestone.target
                          ? "text-amber-500"
                          : "text-gray-400"
                      }`}
                    >
                      {progress.current >= milestone.target ? "✅" : "🔜"}
                    </span>
                    <div>
                      <p className="font-medium">
                        {milestone.target.toLocaleString()} points
                      </p>
                      <p className="text-sm">{milestone.unlock}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg text-center"
            >
              <p className="text-sm font-medium text-amber-800">
                Invite friends to accelerate progress!
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-medium"
              >
                Share Challenge
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CauseTracker;
