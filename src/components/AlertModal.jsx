import {
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const AlertModal = ({
  open,
  isSuccess,
  message,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-white px-8 py-7 text-center shadow-2xl">

        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isSuccess ? "bg-green-50" : "bg-red-50"
            }`}
          >
            {isSuccess ? (
              <FaCheckCircle className="text-4xl text-green-500" />
            ) : (
              <FaExclamationCircle className="text-4xl text-red-500" />
            )}
          </div>
        </div>

        {/* Message */}
        <h2 className="mb-6 text-lg font-semibold leading-6 text-gray-800">
          {message || (isSuccess ? "Success" : "Error")}
        </h2>

        {/* OK Button */}
        <button
          type="button"
          onClick={() => onClose(isSuccess)}
          className={`w-full rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSuccess
              ? "bg-green-500 hover:bg-green-600 focus:ring-green-400"
              : "bg-red-500 hover:bg-red-600 focus:ring-red-400"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertModal;