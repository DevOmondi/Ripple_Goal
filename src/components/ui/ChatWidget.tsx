import { useState } from "react";
import { motion } from "framer-motion";

interface ChatWidgetProps {
  onClose: () => void;
  initialMessage: string;
  apiEndpoint: string;
  userId: string;
}

const ChatWidget = ({
  onClose,
  initialMessage,
  apiEndpoint,
  userId,
}: ChatWidgetProps) => {
  const [messages, setMessages] = useState([
    { text: initialMessage, isUser: false },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          userId,
          conversationHistory: messages,
        }),
      });

      // First check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const text = await response.text();
      if (!text) {
        throw new Error("Empty response from server");
      }

      // Try to parse JSON
      const data = JSON.parse(text);

      // Check if response has the expected structure
      if (!data.response) {
        throw new Error("Invalid response format");
      }

      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error("Error calling AI agent:", error);
      let errorMessage =
        "Sorry, I'm having trouble connecting. Please try again later.";

      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          text: errorMessage,
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 right-4 w-80 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
    >
      {/* Rest of your component remains the same */}
      <div className="bg-teal-600 text-white p-3 flex justify-between items-center">
        <h3 className="font-bold">AI Goal Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-teal-200">
          ✕
        </button>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.isUser
                  ? "bg-teal-100 text-teal-900"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your goals here..."
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-teal-600 text-white px-4 py-2 rounded-r-lg hover:bg-teal-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWidget;
