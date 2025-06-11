import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { FC } from "react";

interface WeeklyMessage {
  id: number;
  title: string;
  reflection: string;
  guidance: string;
  collectiveImpact: string;
}

interface WeeklyMessageCardProps {
  message: WeeklyMessage;
}

const WeeklyMessageCard: FC<WeeklyMessageCardProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{
        y: visible ? 0 : 50,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        damping: 12,
        stiffness: 100,
      }}
      className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-teal-400 relative"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-4 right-4 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center"
      >
        <span className="text-2xl">💌</span>
      </motion.div>

      <h2 className="text-xl font-bold text-teal-800 mb-4">{message.title}</h2>

      <div className="space-y-4">
        <Section
          title="Your Reflection"
          content={message.reflection}
          icon="🌱"
          delay={0.1}
        />

        <Section
          title="This Week's Focus"
          content={message.guidance}
          icon="✨"
          delay={0.2}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-teal-50 p-4 rounded-xl border border-teal-100"
        >
          <div className="flex items-start">
            <span className="text-2xl mr-2">🌍</span>
            <div>
              <h3 className="font-bold text-teal-700">Collective Impact</h3>
              <p className="text-teal-800">{message.collectiveImpact}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface SectionProps {
  title: string;
  content: string;
  icon: string;
  delay: number;
}

const Section: FC<SectionProps> = ({ title, content, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
  >
    <div className="flex items-start">
      <span className="text-2xl mr-2">{icon}</span>
      <div>
        <h3 className="font-semibold text-teal-700">{title}</h3>
        <p className="text-gray-700">{content}</p>
      </div>
    </div>
  </motion.div>
);

export default WeeklyMessageCard;
