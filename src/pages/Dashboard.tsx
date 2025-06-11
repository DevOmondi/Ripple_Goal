import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import WeeklyMessageCard from "../components/WeeklyMessageCard";
import ProgressVisualization from "../components/ProgressVisualization";
import CauseTracker from "../components/CauseTracker";
import LogProgressButton from "../components/LogProgressButton";
import { useAuth } from "../hooks/useAuth";

// Type Definitions
interface WeeklyMessage {
  id: number;
  title: string;
  reflection: string;
  guidance: string;
  collectiveImpact: string;
}

interface ProgressData {
  goal: string;
  current: number;
  target: number;
  unit: string;
}

interface CommunityProgress {
  cause: string;
  current: number;
  target: number;
  nextUnlock: string;
}

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  console.log("User authenticated:", isAuthenticated);
  const [weeklyMessage, setWeeklyMessage] = useState<WeeklyMessage | null>(
    null
  );
  const [userProgress, setUserProgress] = useState<ProgressData | null>(null);
  const [communityProgress, setCommunityProgress] =
    useState<CommunityProgress | null>(null);

  // Mock data initialization
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setWeeklyMessage({
        id: 1,
        title: "Your Momentum is Building!",
        reflection: "You've logged 3 mindful moments last week - great start!",
        guidance:
          "This week, try incorporating 5 minutes of morning meditation",
        collectiveImpact:
          "Your efforts contributed to 15% of our community's goal to fund mental health resources!",
      });

      setUserProgress({
        goal: "Daily Mindfulness",
        current: 3,
        target: 21,
        unit: "sessions",
      });

      setCommunityProgress({
        cause: "Mental Health Support",
        current: 34250,
        target: 50000,
        nextUnlock: "Fund a workshop for 100 students",
      });
    }, 800);
  }, []);

  const handleLogProgress = (amount: number) => {
    if (userProgress) {
      setUserProgress((prev) => ({
        ...prev!,
        current: prev!.current + amount,
      }));
    }

    if (communityProgress) {
      setCommunityProgress((prev) => ({
        ...prev!,
        current: prev!.current + amount * 150,
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-teal-50 to-cyan-100 p-4"
    >
      <header className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-700"
        >
          <img
            src="/ripple_goal_logo_black.png"
            alt="Ripple Growth Logo"
            className="inline-block w-16 h-16 mr-2"
          />
        </motion.h1>
        <div className="w-10 h-10 rounded-full bg-teal-200 border-2 border-white"></div>
      </header>

      <main className="space-y-8 pb-24">
        {weeklyMessage ? (
          <WeeklyMessageCard message={weeklyMessage} />
        ) : (
          <MessageSkeleton />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userProgress ? (
            <ProgressVisualization
              progress={userProgress as ProgressData}
              isPersonal={true}
            />
          ) : (
            <ProgressSkeleton />
          )}

          {communityProgress ? (
            <CauseTracker progress={communityProgress as CommunityProgress} />
          ) : (
            <ProgressSkeleton />
          )}
        </div>
      </main>

      <LogProgressButton onLog={handleLogProgress} />
    </motion.div>
  );
};

// Loading Skeletons
const MessageSkeleton = () => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="bg-white rounded-2xl p-6 shadow-lg h-64"
  ></motion.div>
);

const ProgressSkeleton = () => (
  <div className="bg-white/80 rounded-2xl p-6 shadow-lg h-48">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
    <div className="h-8 bg-gray-200 rounded-full"></div>
  </div>
);

export default Dashboard;
