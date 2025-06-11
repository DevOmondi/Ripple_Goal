import { motion } from "framer-motion";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../firebaseConfig";
import { Github } from "lucide-react";
import { useToast } from "../hooks/useToast";

// SVG Icons
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const Login = () => {
  const { showSuccess, ToastContainer } = useToast();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("Logged in user", user);
          if (user) {
            showSuccess("Login successful!", {
              details: `Welcome back ${user.displayName}!`,
            });
            const timeout = setTimeout(() => {
              navigate("/onboarding");
            }, 3000);
            return () => clearTimeout(timeout);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Registration error:", errorCode, errorMessage);
          setError(errorMessage || "Registration failed");
        });
    } catch (err) {
      setError((err as Error).message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  // Handle sign In with google
  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, googleAuthProvider);
      if (response) {
        const registeredUser = response.user;
        showSuccess("Google sign in successful!", {
          details: `Welcome back ${registeredUser.displayName}! Nice to see you again😊.`,
        });
        const timeout = setTimeout(() => {
          navigate("/onboarding");
        }, 4000);
        return () => clearTimeout(timeout);
      }
    } catch (error) {
      setError((error as Error).message || "Login failed");
      console.error("Google sign in error:", error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-teal-50 to-cyan-100 flex items-center justify-center p-4"
    >
      <ToastContainer />
      <motion.div
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            transition: { duration: 4, repeat: Infinity },
          }}
          className="text-center mb-6 text-6xl"
        >
          👋
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
              Welcome Back
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Grow yourself, grow the good
            </p>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center p-3 border border-gray-300 rounded-lg  cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <GoogleIcon />
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex items-center justify-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-800" />
              </motion.button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-amber-600"
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium text-white ${
                  isLoading
                    ? "bg-teal-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:cursor-pointer"
                }`}
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-gray-600 text-sm">
              New to Ripple Goal?{" "}
              <Link
                to="/register"
                className="font-medium text-emerald-600 hover:text-amber-600"
              >
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -5, 0],
            transition: { duration: 3, repeat: Infinity },
          }}
          className="mt-6 text-center text-gray-500 text-sm"
        >
          <p>Your journey to collective impact starts here</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
