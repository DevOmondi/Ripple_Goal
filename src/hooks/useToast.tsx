import { useState } from "react";
import ErrorToast from "../components/ui/shared/ErrorToast";
import SuccessToast from "../components/ui/shared/SuccessToast";
interface ToastItem {
  id: string;
  message: string;
  details?: string;
  code?: string | number;
  variant: "error" | "success";
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Function to remove a toast by its ID
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Call this to show error toast
  const showError = (
    message: string,
    options?: {
      details?: string;
      errorCode?: string | number;
    }
  ) => {
    const id = Math.random().toString(36).substring(2, 9);

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        details: options?.details,
        code: options?.errorCode,
        variant: "error",
      },
    ]);

    setTimeout(() => removeToast(id), 5000);
  };

  // Call this to show success toast
  const showSuccess = (
    message: string,
    options?: {
      details?: string;
      successCode?: string | number;
    }
  ) => {
    const id = Math.random().toString(36).substring(2, 9);

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        details: options?.details,
        code: options?.successCode,
        variant: "success",
      },
    ]);

    setTimeout(() => removeToast(id), 5000);
  };

  const ToastContainer = () => (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {toasts.map((toast) =>
        toast.variant === "error" ? (
          <ErrorToast
            key={toast.id}
            message={toast.message}
            details={toast.details}
            errorCode={toast.code}
            onClose={() => removeToast(toast.id)}
            autoClose={5000}
          />
        ) : (
          <SuccessToast
            key={toast.id}
            message={toast.message}
            details={toast.details}
            successCode={toast.code}
            onClose={() => removeToast(toast.id)}
            autoClose={5000}
          />
        )
      )}
    </div>
  );

  return { showError, showSuccess, ToastContainer };
};
