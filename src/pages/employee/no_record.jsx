const NoRecord = (data) => {
  const message = "No Record Found";
  if (data) {
    console.log(data);
  }
  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9 9 0 100-18 9 9 0 000 18z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.5 15.5c1.8-1.5 5.2-1.5 7 0"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-slate-800">
          {message}
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm leading-6 text-slate-500">
          We couldn't find any record associated with your account.
          Please contact the administrator if you believe this is an error.
        </p>

        {/* Divider */}
        <div className="my-6 border-t border-slate-200" />

        {/* Additional information */}
        <p className="text-xs text-slate-400">
          If you need assistance, please contact the system administrator.
        </p>
      </div>
    </div>
  );
};

export default NoRecord;