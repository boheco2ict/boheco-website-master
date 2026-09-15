import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AccountNavigator = ({
  currentIndex,
  totalAccounts,
  onPrevious,
  onNext,
}) => {
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < totalAccounts - 1;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
          hasPrevious
            ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
        }`}
      >
        <FaChevronLeft className="text-xs" />
      </button>

      <span className="min-w-[55px] text-center text-xs font-semibold text-slate-500">
        {currentIndex + 1} / {totalAccounts}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
          hasNext
            ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
        }`}
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
};

export default AccountNavigator;