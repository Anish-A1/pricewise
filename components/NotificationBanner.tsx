import { FC, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Importing icons for success and error

interface NotificationBannerProps {
  message: string;
  type: "success" | "error";
  onClose: () => void; // Function to handle closing the notification
}

const NotificationBanner: FC<NotificationBannerProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close the notification after 5 seconds
    }, 4000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [message, onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 sm:pl-7 sm:pr-7 max-w-[90%] sm:max-w-lg text-center text-sm sm:text-base font-medium rounded-lg shadow-lg flex items-center space-x-4 transition-all duration-500 ease-in-out ${
        type === "success"
          ? "bg-green-100 text-green-700 border-l-4 border-green-500"
          : "bg-red-100 text-red-700 border-l-4 border-red-500"
      }`}
      style={{
        opacity: 1, // Make sure the opacity is 1 on the initial render
      }}
    >
      {/* Icon for success/error */}
      <div className={`text-xl ${type === "success" ? "text-green-500" : "text-red-500"}`}>
        {type === "success" ? (
          <FaCheckCircle />
        ) : (
          <FaTimesCircle />
        )}
      </div>

      {/* Message Text */}
      <p
        className={`flex-1 text-base leading-tight ${type === "success" ? "text-green-700" : "text-red-700"}`}
        style={{
          fontWeight: 400, // Slightly lighter text for sleekness
          letterSpacing: "0.5px", // Adding a little spacing for that premium feel
          wordBreak: "break-word", // Ensures text wraps properly
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default NotificationBanner;
