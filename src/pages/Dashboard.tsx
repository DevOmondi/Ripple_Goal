import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressVisualization from "../components/ProgressVisualization";
import CauseTracker from "../components/CauseTracker";
import Checkin from "../components/Checkin";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import type { Goal, Milestone } from "../../types/goalTypes";

import Modal from "../components/ui/shared/Modal";
// import ChatWidget from "../components/ui/ChatWidget";
import { N8NchatWidget } from "../components/ui/N8NchatWidget";

interface CommunityProgress {
  milestones: Milestone[];
  cause: string;
  current: number;
  target: number;
  nextUnlock: string;
}

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [communityProgress, setCommunityProgress] =
    useState<CommunityProgress | null>(null);

  const [showAIPopup, setShowAIPopup] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  const handleCheckinSuccess = () => {
    const fetchData = async () => {
      try {
        const goalsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/goals`,
          { params: { userId, withCheckins: true } }
        );
        setGoals(goalsResponse.data.data);

        if (goalsResponse.data.data.length > 0) {
          const goal = goalsResponse.data.data[0];
          setCommunityProgress({
            cause: goal.Cause.name,
            current: goal.Cause.currentTotal,
            target:
              goal.nextMilestone?.targetValue ||
              goal.Cause.Milestones[0]?.targetValue ||
              0,
            milestones: goal.Cause.Milestones,
            nextUnlock: goal.nextMilestone?.action || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  };

  useEffect(() => {
    if (isAuthenticated && userId && !hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowAIPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, userId, hasSeenPopup]);

  const handleAcceptAI = () => {
    setShowAIPopup(false);
    setHasSeenPopup(true);
    localStorage.setItem("hasSeenAIPopup", "true");
  };

  const handleDeclineAI = () => {
    setShowAIPopup(false);
    setHasSeenPopup(true);
    localStorage.setItem("hasSeenAIPopup", "true");
  };

  const generateReflection = (goal: Goal) => {
    if (!goal.Checkins || goal.Checkins.length === 0) {
      return "No check-ins yet this week. Let's get started!";
    }
    const total = goal.Checkins.reduce((sum, c) => sum + c.value, 0);
    return `You've completed ${total} ${goal.frequencyUnit} toward your goal of ${goal.targetFrequency} ${goal.frequencyUnit}.`;
  };

  const generateLastCheckin = (goal: Goal) => {
    if (!goal.Checkins || goal.Checkins.length === 0) {
      return "No check-ins yet this week.";
    }
    const lastCheckin = goal.Checkins[0];
    return `Last check-in: ${lastCheckin.notes || "No notes"}`;
  };

  const getNextMilestone = (goal: Goal): Milestone | null => {
    if (!goal.Cause?.Milestones?.length) return null;

    // Sort milestones by targetValue and find the first unachieved one
    const sortedMilestones = [...goal.Cause.Milestones].sort(
      (a, b) => a.targetValue - b.targetValue
    );
    return (
      sortedMilestones.find((m) => goal.Cause.currentTotal < m.targetValue) ||
      null
    );
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/");

    const fetchData = async () => {
      try {
        // Fetch user goals with checkins
        const goalsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/goals`,
          { params: { userId, withCheckins: true } }
        );
        // console.log("Goals response:", goalsResponse.data.data);
        setGoals(goalsResponse.data.data);

        // Set community progress from the first goal's cause data
        if (goalsResponse.data.data.length > 0) {
          const goal = goalsResponse.data.data[0];
          setCommunityProgress({
            cause: goal.Cause.name,
            current: goal.Cause.currentTotal,
            target:
              goal.nextMilestone?.targetValue ||
              goal.Cause.Milestones[0]?.targetValue ||
              0,
            milestones: goal.Cause.Milestones,
            nextUnlock: goal.nextMilestone?.action || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) fetchData();
  }, [isAuthenticated, navigate, userId]);

  const renderCommunityImpact = (goal: Goal) => {
    if (!goal.Cause) return null;

    const nextMilestone = getNextMilestone(goal);
    const currentTotal = goal.Cause.currentTotal;
    const targetValue = nextMilestone?.targetValue || 0;
    const isCompleted = currentTotal >= targetValue;

    return (
      <div className="pt-4 md:pt-6 border-t border-gray-100">
        <h4 className="font-semibold text-sm md:text-base text-teal-700 mb-2 md:mb-3">
          {goal.Cause.name} Impact
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-teal-50 to-cyan-100 p-4 md:p-6"
    >
      {/* AI Chat Widget  */}
      <div className="fixed bottom-4 right-4 z-40">
        <N8NchatWidget />
      </div>

      {/* AI Reminder Popup */}
      {showAIPopup && (
        <Modal onClose={handleDeclineAI}>
          <div className="p-6 text-center">
            <h3 className="text-lg font-bold text-teal-800 mb-3">
              Get AI-Powered Reminders
            </h3>
            <p className="text-gray-700 mb-4">
              Would you like our AI assistant to help you set personalized
              reminders and stay on track with your goals?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeclineAI}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                No Thanks
              </button>
              <button
                onClick={handleAcceptAI}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                Yes, Please!
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Header */}
      <header className="flex justify-between items-center mb-6 md:mb-8">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="flex items-center"
        >
          <img
            src="/ripple_goal_logo_black.png"
            alt="Ripple Growth Logo"
            className="w-12 h-12 md:w-16 md:h-16 mr-2"
          />
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-700">
            Ripple Goal
          </h1>
        </motion.div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-teal-200 border-2 border-white"></div>
      </header>

      <main className="space-y-6 md:space-y-8 pb-24">
        {/* Goals Section */}
        <section className="space-y-4 md:space-y-6">
          <h2 className="text-lg md:text-xl font-bold text-teal-800">
            Your Goals Progress
          </h2>

          {goals.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg"
                >
                  {/* Goal Header  */}
                  <div className="flex items-start mb-3 md:mb-4">
                    {" "}
                    <span className="text-2xl mr-2 md:mr-3">
                      {goal.Cause.emoji}{" "}
                    </span>{" "}
                    <div>
                      {" "}
                      <h3 className="font-bold text-base md:text-lg">
                        {goal.title}{" "}
                      </h3>{" "}
                      <p className="text-xs md:text-sm text-gray-600">
                        Target: {goal.targetFrequency} {goal.frequencyUnit}
                        /week{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>
                  {/* Progress Visualization */}
                  <div className="mb-3 md:mb-4">
                    <ProgressVisualization
                      progress={{
                        goal: goal.title,
                        current: goal.progress.current,
                        target: goal.progress.target,
                        unit: goal.frequencyUnit,
                        emoji: goal.Cause.emoji,
                      }}
                      isPersonal={true}
                    />
                  </div>
                  {/* Reflection Section */}
                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-sm md:text-base text-teal-700 mb-1 md:mb-2">
                      Your Reflection
                    </h4>
                    <p className="text-xs md:text-sm text-gray-700">
                      {generateReflection(goal)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-700">
                      {generateLastCheckin(goal)}
                    </p>
                  </div>
                  {/* Recent Checkins */}
                  {goal.Checkins && goal.Checkins.length > 0 && (
                    <div className="mb-3 md:mb-4">
                      <h5 className="text-xs md:text-sm font-medium text-gray-600 mb-1">
                        Recent Check-ins:
                      </h5>
                      <ul className="space-y-1 text-xs md:text-sm">
                        {goal.Checkins.slice(0, 3).map((checkin) => (
                          <li key={checkin.id} className="text-gray-600">
                            {new Date(checkin.checkinDate).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                            : {checkin.value} {goal.frequencyUnit} -{" "}
                            {checkin.notes || "No notes"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/*  Community Impact Section */}
                  {goal.Cause && renderCommunityImpact(goal)}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl md:rounded-2xl p-6 shadow-lg text-center">
              <p className="text-sm md:text-base text-gray-600">
                You don't have any goals yet. Create one to get started!
              </p>
            </div>
          )}
        </section>

        {/* Community Progress Section */}
        {goals.length > 0 && goals[0].Cause && (
          <section>
            <h2 className="text-lg md:text-xl font-bold text-teal-800 mb-4 md:mb-6">
              Community Progress
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <CauseTracker progress={communityProgress} />
            </div>
          </section>
        )}
      </main>

      {/* Checkin Button */}
      <div className="fixed bottom-4  left-4 z-30 mr-4">
        <Checkin
          onCheckinSuccess={handleCheckinSuccess}
          goals={goals}
          userId={userId}
        />
      </div>
    </motion.div>
  );
};

export default Dashboard;
