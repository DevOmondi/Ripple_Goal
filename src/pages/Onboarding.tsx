import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";

interface FormData {
  name: string;
  goalTitle: string;
  targetFrequency: string;
  frequencyUnit: "times" | "minutes" | "days";
  causeId: number | null;
  userId: string | null;
}

interface Cause {
  id: string;
  emoji: string;
  name: string;
  conversionRate: number;
}

const Onboarding = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();

  const userId = location.state?.userId;

  const { showError, ToastContainer } = useToast();
  const [step, setStep] = useState<number>(1);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    goalTitle: "",
    targetFrequency: "3",
    frequencyUnit: "times",
    causeId: null,
    userId: userId,
  });

  // Function to get causes
  const fetchAvailableCauses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/causes`
      );
      // console.log("Available causes response:", response);
      setCauses(response.data.causes);
    } catch (error) {
      console.error("Error fetching available causes:", error);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.goalTitle.trim())
        newErrors.goalTitle = "Goal description is required";
      if (
        !formData.targetFrequency ||
        isNaN(Number(formData.targetFrequency))
      ) {
        newErrors.targetFrequency = "Valid target is required";
      }
    }

    if (step === 3 && !formData.causeId) {
      newErrors.causeId = "Please select a cause";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit onboarding details
      try {
        const payload = {
          userId: formData.userId,
          title: formData.goalTitle,
          targetFrequency: parseInt(formData.targetFrequency),
          frequencyUnit: formData.frequencyUnit,
          causeId: parseInt(String(formData.causeId) || "0"),
          status: "ACTIVE",
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/goals/create-goal`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          navigate("/dashboard", { state: { userId: userId } });
        }
      } catch (error) {
        console.error("Error creating goal:", error);
        showError("An error occured while onboarding you, please try again.😞");
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCauseSelect = (causeId: string) => {
    setFormData({ ...formData, causeId: Number(causeId) });
    if (errors.causeId) {
      setErrors((prev) => ({ ...prev, causeId: "" }));
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    if (isAuthenticated) fetchAvailableCauses();
  }, [isAuthenticated, navigate]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-teal-50 to-cyan-100 p-6"
    >
      <ToastContainer />
      <div className="max-w-md mx-auto">
        {/* Progress indicator */}
        <motion.div className="flex justify-between mb-8 relative">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative flex flex-col items-center z-10">
              <motion.div
                animate={{
                  backgroundColor: i <= step ? "#0d9488" : "#e5e7eb",
                  scale: i === step ? 1.2 : 1,
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mb-1"
              >
                {i}
              </motion.div>
              <motion.span
                animate={{ color: i <= step ? "#0f766e" : "#9ca3af" }}
                className="text-xs font-medium"
              >
                {["Welcome", "Goal", "Cause", "Ready"][i - 1]}
              </motion.span>
            </div>
          ))}
          <motion.div
            className="absolute h-1 bg-gray-200 top-4 left-4 right-4"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: (step - 1) / 3,
              originX: 0,
              backgroundColor: step > 1 ? "#0d9488" : "#e5e7eb",
            }}
          />
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: step > 1 ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: step < 4 ? -50 : 50, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          >
            {step === 1 && (
              <div className="text-center">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to Ripple Goal
                </h2>
                <p className="text-gray-600 mb-6">
                  Transform your weekly wins into collective change.
                </p>
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    transition: { duration: 3, repeat: Infinity },
                  }}
                >
                  <span className="text-4xl">👇</span>
                </motion.div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Define Your Goal
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Alex Johnson"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Goal Description
                    </label>
                    <input
                      type="text"
                      name="goalTitle"
                      value={formData.goalTitle}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                        errors.goalTitle ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. Run, Meditate, Learn Spanish"
                    />
                    {errors.goalTitle && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" /> {errors.goalTitle}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target
                      </label>
                      <input
                        type="number"
                        name="targetFrequency"
                        min="1"
                        max="100"
                        value={formData.targetFrequency}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                          errors.targetFrequency
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.targetFrequency && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />{" "}
                          {errors.targetFrequency}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <select
                        name="frequencyUnit"
                        value={formData.frequencyUnit}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value="times">Times per week</option>
                        <option value="minutes">Minutes per day</option>
                        <option value="days">Days per week</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Choose Your Cause
                </h2>
                <p className="text-gray-600 mb-6">
                  Your progress will contribute to:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {causes?.map((cause) => (
                    <motion.button
                      key={cause.id}
                      type="button"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      animate={{
                        borderColor:
                          formData.causeId === Number(cause.id)
                            ? "#0d9488"
                            : "#e5e7eb",
                        backgroundColor:
                          formData.causeId === Number(cause.id)
                            ? "#f0fdfa"
                            : "#ffffff",
                      }}
                      className="p-4 border-2 rounded-xl text-center"
                      onClick={() => handleCauseSelect(cause.id)}
                    >
                      <span className="text-2xl block mb-2">{cause.emoji}</span>
                      <span className="font-medium">{cause.name}</span>
                      <span className="text-xs text-teal-600 block mt-1">
                        {cause.conversionRate} pts/activity
                      </span>
                    </motion.button>
                  ))}
                </div>
                {errors.causeId && (
                  <p className="mt-3 text-sm text-red-600 flex items-center justify-center">
                    <XCircle className="w-4 h-4 mr-1" /> {errors.causeId}
                  </p>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  All Set, {formData.name}!
                </h2>

                <div className="bg-teal-50 rounded-xl p-4 mb-4 text-left">
                  <h3 className="font-bold text-teal-800 mb-2">Your Goal</h3>
                  <p className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                    <span className="font-medium">
                      {formData.goalTitle} {formData.targetFrequency}{" "}
                      {formData.frequencyUnit}/week
                    </span>
                  </p>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 text-left">
                  <h3 className="font-bold text-amber-800 mb-2">Supporting</h3>
                  <p className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-amber-600 mr-2" />
                    <span className="font-medium">
                      {
                        causes.find((c) => c.id === String(formData.causeId))
                          ?.name
                      }
                    </span>
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    Each activity contributes{" "}
                    {
                      causes.find((c) => c.id === String(formData.causeId))
                        ?.conversionRate
                    }{" "}
                    points to our community goal
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          {step > 1 && (
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium"
            >
              Back
            </motion.button>
          )}

          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className={`px-6 py-3 rounded-lg font-medium ml-auto ${
              step === 4
                ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white"
                : "bg-teal-600 text-white"
            }`}
          >
            {step === 4 ? "Start My Journey" : "Continue"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Onboarding;
