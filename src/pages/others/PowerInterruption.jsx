import React, { useEffect, useState } from "react";
import { getPowerInterruption } from "../../services/getservices";

const PowerInteruption = () => {
  const [powerInterruptions, setPowerInterruptions] = useState({
    schedule: [],
    unschedule: [],
  });

  const [loading, setLoading] = useState(true);

  // Separate active item for each section
  const [scheduleIndex, setscheduleIndex] = useState(0);
  const [unscheduleIndex, setUnscheduleIndex] = useState(0);

  useEffect(() => {
    const fetchPowerInterruptions = async () => {
      try {
        setLoading(true);
        const data = await getPowerInterruption();
        setPowerInterruptions(data || { schedule: [], unschedule: [] });
      } catch (error) {
        console.error("Error loading power interruptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPowerInterruptions();
  }, []);

  const schedule = powerInterruptions.schedule || [];
  const unschedule = powerInterruptions.unschedule || [];

  return (
    <div className="min-h-screen w-full bg-image2 px-4 py-10 md:px-8 lg:px-12 mt-[75px]">
      <div className="w-full">
        {/* =====================================
            HEADER
        ====================================== */}
        <div className="mb-10 border-b border-stone-200 pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Left: Icon + Title */}
            <div className="flex items-center gap-4">

              {/* Icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-900 shadow-sm">
                <svg
                  className="h-7 w-7 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              {/* Title */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
                    Power Interruption
                  </h1>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500 md:text-base">
                  Stay informed about schedule and unschedule power
                  interruptions and service updates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            LOADING
        ====================================== */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-amber-800" />
              <p className="text-sm text-stone-500">
                Loading power interruptions…
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* =====================================
                schedule
            ====================================== */}
            <div className="w-full rounded-2xl border border-stone-200 bg-white p-5 md:p-7">
              <PowerInterruptionSection
                title="Schedule Power Interruptions"
                description="Planned maintenance affecting service in your area."
                items={schedule}
                activeIndex={scheduleIndex}
                setActiveIndex={setscheduleIndex}
                type="schedule"
              />
            </div>

            {/* =====================================
                UNschedule
            ====================================== */}
            <div className="w-full rounded-2xl border border-stone-200 bg-white p-5 md:p-7">
              <PowerInterruptionSection
                title="Unschedule Power Interruptions"
                description="Unplanned outages currently being addressed."
                items={unschedule}
                activeIndex={unscheduleIndex}
                setActiveIndex={setUnscheduleIndex}
                type="unschedule"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   POWER INTERRUPTION SECTION
===================================================== */

const PowerInterruptionSection = ({
  title,
  description,
  items,
  activeIndex,
  setActiveIndex,
  type,
}) => {
  const isschedule = type === "schedule";
  const activeItem = items[activeIndex];

  const accent = isschedule
    ? {
        text: "text-amber-800",
        bg: "bg-amber-800",
        bgHover: "hover:bg-amber-900",
        border: "border-amber-800",
        soft: "bg-amber-50",
      }
    : {
        text: "text-red-800",
        bg: "bg-red-800",
        bgHover: "hover:bg-red-900",
        border: "border-red-800",
        soft: "bg-red-50",
      };

  const goPrevious = () => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goNext = () => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <section>
      {/* =====================================
          SECTION HEADER
      ====================================== */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-md ${accent.soft}`}
          >
            {isschedule ? (
              <svg
                className={`h-4.5 w-4.5 ${accent.text}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                />
              </svg>
            ) : (
              <svg
                className={`h-4.5 w-4.5 ${accent.text}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M10.29 3.86l-7.82 13.5A2 2 0 004.2 20.5h15.6a2 2 0 001.73-3.14l-7.82-13.5a2 2 0 00-3.42 0z"
                />
              </svg>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
            <p className="text-sm text-stone-500">{description}</p>
          </div>
        </div>

        {items.length > 0 && (
          <span
            className={`hidden shrink-0 rounded-full border ${accent.border} px-3 py-1 text-xs font-medium ${accent.text} sm:inline-block`}
          >
            {items.length} {items.length === 1 ? "notice" : "notices"}
          </span>
        )}
      </div>

      {/* =====================================
          EMPTY STATE
      ====================================== */}
      {items.length === 0 ? (
        <EmptyState
          message={
            isschedule
              ? "No schedule power interruptions have been announced."
              : "No unschedule power interruptions have been reported."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* =====================================
              LEFT - IMAGE PREVIEW
          ====================================== */}
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
            {/* Image */}
            <div className="relative flex h-[420px] items-center justify-center overflow-hidden bg-stone-100 md:h-[540px]">
              <img
                src={activeItem.image_url}
                alt="Power Interruption Preview"
                className="h-full w-full object-contain"
              />

              {/* Bottom Gradient */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-950/85 to-transparent" />

              {/* PREVIOUS BUTTON */}
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={goPrevious}
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm transition hover:bg-white"
                  aria-label="Previous"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {/* NEXT BUTTON */}
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm transition hover:bg-white"
                  aria-label="Next"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}

              {/* IMAGE INFORMATION */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-medium text-white/70">
                  Posted {formatDate(activeItem.created_at)}
                </p>

                <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-white md:text-xl">
                  {activeItem.description ||
                    (isschedule
                      ? "schedule power interruption"
                      : "Unschedule power interruption")}
                </h3>
              </div>
            </div>

            {/* PREVIEW FOOTER */}
            <div className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="text-sm text-stone-400">
                {activeIndex + 1} of {items.length}
              </p>

              <a
                href={activeItem.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-lg ${accent.bg} ${accent.bgHover} px-4 py-2 text-sm font-medium text-white transition`}
              >
                Open Full Image
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* =====================================
              RIGHT - LIST
          ====================================== */}
          <div className="flex max-h-[620px] flex-col overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
            {/* List Header */}
            <div className="border-b border-stone-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-stone-800">
                All notices
              </h3>
              <p className="mt-0.5 text-xs text-stone-400">
                Latest announcements first
              </p>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {items.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-lg border-l-[3px] px-3 py-3 text-left transition ${
                      isActive
                        ? `${accent.border} bg-white`
                        : "border-transparent hover:bg-white"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-md bg-stone-100">
                      <img
                        src={item.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-stone-800">
                        {item.description ||
                          (isschedule
                            ? "schedule power interruption"
                            : "Unschedule power interruption")}
                      </p>

                      <p className="mt-1 text-xs text-stone-400">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* =====================================================
   DATE FORMAT
===================================================== */

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/* =====================================================
   EMPTY STATE
===================================================== */

const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-16 text-center">
      <svg
        className="mb-3 h-8 w-8 text-stone-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <p className="max-w-xs text-sm text-stone-500">{message}</p>
    </div>
  );
};

export default PowerInteruption;