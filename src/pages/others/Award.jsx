import { useEffect, useState } from "react";

const noticeData = [
  {
    title: "Recognizing Excellence, Powering Progress",
    subtitle: "BOHECO II achievements and recognitions across the years",
    path: "AWARDS/award2025.jpg",
  },
  {
    title: "NEA Recognition",
    subtitle: "National Electrification Administration honors",
    path: "AWARDS/Nea-1.jpg",
  },
  {
    title: "NEA Award",
    subtitle: "Consistent performance and service excellence",
    path: "AWARDS/Nea-2.jpg",
  },
  {
    title: "PHILRECA Recognition",
    subtitle: "Industry recognition for leadership and innovation",
    path: "AWARDS/philreca.jpg",
  },
];

function Award() {
  const [openModal, setOpenModal] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % noticeData.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = noticeData[activeSlide];

  return (
    <div className="bg-image2 min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
            Awards and Recognition
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            BOHECO II: A Legacy of Excellence in Rural Electrification
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            A simplified awards page that highlights BOHECO II recognitions,
            shows the latest image automatically, and keeps the long-form story
            easy to read.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            <div className="relative">
              <img
                src={`https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/${currentSlide.path}`}
                alt={currentSlide.title}
                className="h-[320px] w-full object-cover sm:h-[420px]"
                draggable={false}
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Featured Recognition
                </p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  {currentSlide.title}
                </h2>
                <p className="mt-1 text-sm text-slate-100/90 sm:text-base">
                  {currentSlide.subtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
              {noticeData.map((item, index) => {
                const active = index === activeSlide;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`overflow-hidden rounded-2xl border text-left transition ${
                      active
                        ? "border-amber-500 ring-2 ring-amber-200"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    aria-label={`Show ${item.title}`}
                  >
                    <img
                      src={`https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/${item.path}`}
                      alt={item.title}
                      className="h-20 w-full object-cover"
                      draggable={false}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-lg sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
                  Quick Overview
                </p>
                <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                  Why these awards matter
                </h3>
              </div>
              <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                Auto-slide on
              </div>
            </div>

            <p className="mt-4 leading-7 text-slate-600">
              BOHECO II continues to receive recognition from NEA, PHILRECA,
              and partner institutions for performance, innovation, and service
              excellence. The slideshow above rotates automatically every few
              seconds so visitors can quickly see the featured recognitions.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Simple navigation</p>
                <p className="mt-1 text-sm text-slate-600">
                  Tap any thumbnail to jump directly to a specific award image.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Cleaner reading flow</p>
                <p className="mt-1 text-sm text-slate-600">
                  Important details are grouped into smaller sections for easier
                  browsing on desktop and mobile.
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-amber-700"
            >
              Read Full Story
            </button>
          </div>
        </div>

        {/* MODAL */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-lg font-bold text-slate-800 sm:text-2xl">
                  BOHECO II: A Legacy of Excellence in Rural Electrification
                </h2>
                <button
                  onClick={() => setOpenModal(false)}
                  className="rounded-full px-3 py-1 text-3xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close awards story"
                >
                  &times;
                </button>
              </div>
              <div className="max-h-[75vh] overflow-y-auto p-6">
                <article className="space-y-5 text-base leading-8 text-slate-700 sm:text-lg">
                  <p>
                    For more than a decade, Bohol II Electric Cooperative, Inc.
                    (BOHECO II) has consistently demonstrated excellence in power
                    distribution, institutional management, member-consumer
                    engagement, and public service. Through the years, the Cooperative
                    has earned numerous recognitions from the National Electrification
                    Administration (NEA), the Philippine Rural Electric Cooperatives
                    Association, Inc. (PHILRECA), and various partner institutions—
                    affirming its commitment to delivering reliable and responsive
                    electric service to the people of Bohol.
                  </p>
                  <p>
                    The Cooperative’s journey of recognition began gaining national
                    prominence in 2014, when BOHECO II received several awards,
                    including the DOLE Certificate of Compliance on General Labor
                    Standards, the Energy Development Corporation (EDC) Loyalty Award,
                    and a Plaque of Appreciation from NEA for its contribution to the
                    Yolanda Task Force Kapatid. During the same year, BOHECO II was also
                    recognized as part of the Best Region 7 and earned its Triple-A
                    (AAA) Rating Electric Cooperative distinction.
                  </p>
                  <p>
                    In 2015, BOHECO II sustained its strong performance and continued
                    receiving recognition from NEA, including a Special Award for AAA
                    Electric Cooperative status and acknowledgment for its Sitio
                    Electrification contributions.
                  </p>
                  <p>
                    The years 2016 to 2018 further solidified BOHECO II’s reputation as
                    one of the country’s top-performing electric cooperatives. The
                    Cooperative consistently maintained its AAA rating, achieved
                    single-digit system loss, and posted a 100% total performance score
                    under the NEA assessment.
                  </p>
                  <p>
                    In 2019, BOHECO II received some of the most prestigious recognitions
                    within the electric cooperative sector. These recognitions reflect
                    exemplary performance, sustained commitment to rural electrification,
                    and strong member-consumer empowerment initiatives.
                  </p>
                  <p>
                    Despite the operational challenges brought by the pandemic, BOHECO II
                    continued to excel in 2020 and 2021. The Cooperative earned awards
                    for service excellence, occupational safety and health, multimedia
                    and communication programs, health and wellness initiatives, and
                    community-oriented programs.
                  </p>
                  <p>
                    The Cooperative’s momentum remained strong in 2022 and 2023. NEA and
                    PHILRECA recognized BOHECO II for excellence in collection efficiency,
                    system loss management, workplace development, innovation, digital
                    transformation, and information empowerment initiatives.
                  </p>
                  <p>
                    In 2024, BOHECO II once again demonstrated its unwavering commitment to
                    excellence by receiving recognitions for High AGMA Attendance, Single
                    Digit System Loss, Best Collection Efficiency, Top Performing EC, Best
                    Region of the Year, and Outstanding EC Award.
                  </p>
                  <p>
                    These awards collectively reflect the dedication of BOHECO II’s Board
                    of Directors, management, employees, and member-consumers who continue
                    to work together in advancing reliable electric service and
                    sustainable rural development across the Cooperative’s coverage area.
                  </p>
                  <p>
                    As BOHECO II continues to move forward, these recognitions serve both
                    as milestones of accomplishment and as inspiration to pursue even
                    greater excellence in service, innovation, and community empowerment
                    in the years ahead.
                  </p>
                </article>
              </div>
              <div className="border-t px-6 py-4 flex justify-end bg-slate-50">
                <button
                  onClick={() => setOpenModal(false)}
                  className="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Award;
