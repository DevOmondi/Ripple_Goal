import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { FC } from "react";
import type { Milestone } from "../../types/goalTypes";

interface Progress {
  current: number;
  target: number;
  cause: string;
  nextUnlock?: string;
  milestones: Milestone[];
}

interface CauseTrackerProps {
  progress: Progress | null;
}

const CauseTracker: FC<CauseTrackerProps> = ({ progress }) => {
  const [expanded, setExpanded] = useState(false);

  if (!progress) return null;

  const isTargetReached = progress.current >= progress.target;

  // Separate completed and upcoming milestones
  const completedMilestones = progress.milestones?.filter(
    (m) => progress.current >= m.targetValue
  );
  const upcomingMilestones = progress.milestones?.filter(
    (m) => progress.current < m.targetValue
  );

  const getNextMilestone = (progress: Progress): Milestone | null => {
    if (!progress.milestones?.length) return null;

    // Sort milestones by targetValue and find the first unachieved one
    const sortedMilestones = [...progress.milestones].sort(
      (a, b) => a.targetValue - b.targetValue
    );
    return (
      sortedMilestones.find((m) => progress.current < m.targetValue) || null
    );
  };

  const renderCommunityImpact = (progress: Progress) => {
    if (!progress) return null;

    const nextMilestone = getNextMilestone(progress);
    const currentTotal = progress.current;
    const targetValue = nextMilestone?.targetValue || 0;
    const isCompleted = currentTotal >= targetValue;

    return (
      <div className="pt-4 md:pt-6 border-t border-gray-100">
        <h4 className="font-semibold text-sm md:text-base text-teal-700 mb-2 md:mb-3">
          {progress.cause} Impact
        </h4>

        <div className="mb-3 md:mb-4">
          <div className="flex justify-between text-xs md:text-sm mb-1">
            <span>Community Progress</span>
            <span>
              {isCompleted ? targetValue : currentTotal} / {targetValue}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5">
            <div
              className={`h-full rounded-full ${
                isCompleted ? "bg-green-500" : "bg-teal-600"
              }`}
              style={{
                width: `${Math.min(
                  (currentTotal / (targetValue || 1)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
        </div>

        {nextMilestone && (
          <div className="bg-teal-50 p-3 md:p-4 rounded-lg">
            <p className="text-xs md:text-sm font-medium text-teal-800">
              Next Milestone: {nextMilestone.action}
            </p>
            <p className="text-xs text-teal-600 mt-1">
              {isCompleted ? (
                "Completed!"
              ) : (
                <>{targetValue - currentTotal} more points needed</>
              )}
            </p>
          </div>
        )}
      </div>
    );
  };

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
          {renderCommunityImpact(progress)}
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
            {/* Completed Milestones Section */}
            {completedMilestones?.length > 0 && (
              <div className="border-t border-green-100 pt-4">
                <h4 className="font-semibold text-green-700 mb-3">
                  Achieved Milestones
                </h4>
                <div className="space-y-3">
                  {completedMilestones.map((milestone) => (
                    <motion.div
                      key={milestone.id}
                      className="flex items-start p-3 rounded-lg bg-green-50 border border-green-200"
                    >
                      <span className="text-lg mr-3 text-green-500">✅</span>
                      <div>
                        <p className="font-medium text-green-800">
                          {milestone.targetValue.toLocaleString()} points
                        </p>
                        <p className="text-sm text-green-700">
                          {milestone.action}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Completed!
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Milestones Section */}
            {upcomingMilestones?.length > 0 && (
              <div className="border-t border-amber-100 pt-4">
                <h4 className="font-semibold text-amber-700 mb-3">
                  Upcoming Milestones
                </h4>
                <div className="space-y-3">
                  {upcomingMilestones.map((milestone) => (
                    <motion.div
                      key={milestone.id}
                      whileHover={{ x: 5 }}
                      className="flex items-start p-3 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <span className="text-lg mr-3 text-amber-500">🔜</span>
                      <div>
                        <p className="font-medium">
                          {milestone.targetValue.toLocaleString()} points
                        </p>
                        <p className="text-sm text-gray-700">
                          {milestone.action}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          {Math.max(
                            0,
                            milestone.targetValue - progress.current
                          )}{" "}
                          more to go
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Share Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg text-center"
            >
              <p className="text-sm font-medium text-amber-800">
                {isTargetReached
                  ? "Amazing! You've reached the target!"
                  : "Invite friends to accelerate progress!"}
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`mt-2 px-4 py-2 ${
                  isTargetReached
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-amber-500 hover:bg-amber-600"
                } text-white rounded-full text-sm font-medium transition-colors`}
              >
                {isTargetReached ? "Celebrate!" : "Share Challenge"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CauseTracker;
