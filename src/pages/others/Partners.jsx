import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    src: "assets/prtn.jpg",
    title: "Payment Partners",
    description:
      "Use these accredited channels for secure and convenient bill payments.",
    alt: "BOHECO II payment partners",
  },
  {
    src: "assets/ecp.png",
    title: "ECPAY Merchant Partners List",
    description: "Browse the updated ECPAY merchant partner network.",
    alt: "ECPAY merchant partners list",
  },
];

const Partners = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setActiveSlide(index);
  const goToNext = () =>
    setActiveSlide((current) => (current + 1) % slides.length);
  const goToPrevious = () =>
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);

  const current = slides[activeSlide];

  return (
    <div className="bg-image2 min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
            Payment Services
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Payment Partners
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            View all supported payment channels in one place. Slides rotate
            automatically, and you can also navigate manually using arrows or
            dots.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="relative">
            <img
              className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              src={current.src}
              alt={current.alt}
              draggable={false}
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent p-5 text-white sm:p-6">
              <h2 className="text-xl font-bold sm:text-3xl">{current.title}</h2>
              <p className="mt-1 text-sm text-slate-100/90 sm:text-base">
                {current.description}
              </p>
            </div>

            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
            >
              <FaChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
            >
              <FaChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-slate-600">
              Slide {activeSlide + 1} of {slides.length}
            </p>

            <div className="flex items-center gap-2">
              {slides.map((slide, index) => {
                const active = index === activeSlide;

                return (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to ${slide.title}`}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      active
                        ? "bg-amber-600"
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
