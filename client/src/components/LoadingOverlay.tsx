const LoadingOverlay = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-parchment rounded-lg p-8 max-w-md text-center">
        <div className="mb-4">
          <svg
            className="animate-spin h-12 w-12 text-accent mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h3 className="font-medieval text-2xl text-primary mb-2">
          {message}
        </h3>
        <p className="text-brown-dark">
          {message.includes("DM voice assistant") 
            ? "Connecting to voice services. This may take a moment..." 
            : "Claude is crafting your world. This may take a minute or two..."}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
