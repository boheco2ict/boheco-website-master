import React, { useEffect, useMemo, useState } from "react";

import Section from "../components/Section";
import Glance from "../components/Glance";
import Profile from "../components/Profile";
import CardManagement from "../components/CardManagement";
import CardBoard from "../components/CardBoard";

const About = () => {
  /* PROFILE */
  const members = "158,713";
  const household = "178,051";
  const consumers = "162,595";
  const employees = "279";

  const slides = useMemo(
    () => [
      {
        src: "/assets/m.jpeg",
        title: "Our Mission",
        description: "Quality electric service for growth across Bohol",
      },
      {
        src: "/assets/v.jpeg",
        title: "Our Vision",
        description: "A highly competitive utility focused on MCO satisfaction",
      },
      {
        src: "/assets/l.png",
        title: "BOHECO II Identity",
        description: "A cooperative serving member-consumer-owners",
      },
      {
        src: "/assets/m2.jpg",
        title: "Service Coverage",
        description: "Powering communities across 21 municipalities",
      },
    ],
    []
  );

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <div className="bg-image2 min-h-screen overflow-hidden">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
            About BOHECO II
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Learn Who We Are
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Explore BOHECO II mission, profile, board, and management through a
            clearer and easier-to-navigate page.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <a href="#mission-vision" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            Mission & Vision
          </a>
          <a href="#at-a-glance" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            At a Glance
          </a>
          <a href="#our-profile" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            Profile
          </a>
          <a href="#board" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            Board
          </a>
          <a href="#management" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            Management
          </a>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="relative">
            <img
              src={currentSlide.src}
              alt={currentSlide.title}
              className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              draggable={false}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent p-4 text-white sm:p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
                Auto Slide On
              </p>
              <h2 className="mt-1 text-xl font-bold sm:text-3xl">{currentSlide.title}</h2>
              <p className="mt-1 text-sm text-slate-100/90 sm:text-base">
                {currentSlide.description}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 border-t border-slate-200 bg-slate-50 p-3">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to ${slide.title}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  index === activeSlide
                    ? "bg-amber-600"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Members</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{members}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Households</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{household}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Potential Consumers</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{consumers}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Employees</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{employees}</p>
          </div>
        </div>

        <div id="mission-vision" className="mt-10 rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm sm:p-5">
          <Section />
        </div>

        <div id="at-a-glance" className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm sm:p-5">
          <Glance employees={employees} />
        </div>

        <div id="our-profile" className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm sm:p-5">
          <Profile
            members={members}
            household={household}
            consumers={consumers}
            employees={employees}
          />
        </div>

        <div id="board" className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm sm:p-5">
          <CardBoard />
        </div>

        <div id="management" className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm sm:p-5">
          <CardManagement />
        </div>
      </section>
    </div>
  );
};

export default About;
