import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export const N8NchatWidget = () => {
  const N8N_WEBHOOK_URL =
    "https://devomondi.app.n8n.cloud/webhook/39d21811-bc1a-467a-b09a-01255169298b/chat";
  useEffect(() => {
    createChat({
      webhookUrl: N8N_WEBHOOK_URL,
      webhookConfig: {
        method: "POST",
        headers: {},
      },
      target: "#n8n-chat",
      mode: "window",
      chatInputKey: "chatInput",
      chatSessionKey: "sessionId",
      metadata: {},
      showWelcomeScreen: false,
      defaultLanguage: "en",
      initialMessages: [
        "Hi there! 👋",
        "My name is Goaliath. I will help you set your activities reminders😊",
      ],
      i18n: {
        en: {
          title: "Hi there! 👋",
          subtitle: "Start a chat. I am here to help you 24/7.",
          footer: "",
          getStarted: "New Conversation",
          inputPlaceholder: "Type your goal here...",
          closeButtonTooltip: "Close chat",
        },
      },
    });
  }, [N8N_WEBHOOK_URL]);

  return <div id="n8n-chat"></div>;
};
