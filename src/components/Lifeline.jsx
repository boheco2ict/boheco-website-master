import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineVerticalRight, AiOutlineVerticalLeft } from "react-icons/ai";

const url =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/";

const img = [
  "LIFELINE/Slide2.jpg",
  "LIFELINE/Slide3.jpg",
  "LIFELINE/Slide4.jpg",
  "LIFELINE/Slide5.jpg",
  "LIFELINE/Slide6.jpg",
  "LIFELINE/Slide7.jpg",
  "LIFELINE/Slide8.jpg",
  "LIFELINE/Slide9.jpg",
  "LIFELINE/Slide10.jpg",
  "LIFELINE/Slide11.jpg",
  "LIFELINE/Slide12.jpg",
  "LIFELINE/Slide13.jpg",
  "LIFELINE/Slide14.jpg",
  "LIFELINE/Slide15.jpg",
];

const Lifeline = () => {
  const slides = useMemo(
    () =>
      img.map((path, index) => ({
        path,
        title: `Lifeline Advisory ${index + 1}`,
        description: "Lifeline Rate information and guidance",
      })),
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleOnNextClick = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleOnPreviousClick = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Lifeline Rate Advisory
        </h2>
        <p className="mt-2 text-base text-slate-600 sm:text-lg">
          Slides rotate automatically. Use arrows or dots to navigate quickly.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
      >
        <div className="relative">
          <img
            draggable={false}
            src={url + currentSlide.path}
            alt={currentSlide.title}
            className="h-[300px] w-full object-contain bg-slate-100 p-2 sm:h-[440px] lg:h-[560px]"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-4 text-white sm:p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
              Slide {currentIndex + 1} of {slides.length}
            </p>
            <h3 className="mt-1 text-xl font-bold sm:text-2xl">{currentSlide.title}</h3>
            <p className="mt-1 text-sm text-slate-100/90 sm:text-base">
              {currentSlide.description}
            </p>
          </div>

          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
            onClick={handleOnPreviousClick}
            aria-label="Previous lifeline slide"
          >
            <AiOutlineVerticalRight size={22} />
          </button>

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
            onClick={handleOnNextClick}
            aria-label="Next lifeline slide"
          >
            <AiOutlineVerticalLeft size={22} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-slate-200 bg-slate-50 p-3">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;

            return (
              <button
                key={slide.path}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  isActive
                    ? "bg-amber-600"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${slide.title}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Lifeline;
