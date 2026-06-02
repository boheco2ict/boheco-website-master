import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

const assetBaseUrl =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/";

const noticeData = [
  {
    title: "RPH-NTP-R7-Distribution-Transformers-PB-ITB-R7-1-2025",
    path: "NOTICE/RPH-NTP-R7-Distribution-Transformers-(PB-ITB-R7-1-2025).jpg",
    url: "https://drive.google.com/file/d/1IzOFad_MX6Wt3zfTkpPUXDc6ckE8Mm9m/view?usp=sharing",
  },
  {
    title: "RPH-NTP-R7-Steel-Poles-PB-ITB-R7-2-2025",
    path: "NOTICE/RPH-NTP-R7-Steel-Poles-(PB-ITB-R7-2-2025).jpg",
    url: "https://drive.google.com/file/d/1j63aP7sgdM1FvbIkT1TrlSMx-2Rh5jtw/view?usp=sharing",
  },
  {
    title: "RPH-NTP-R7-Conductors-PB-ITB-R7-3-2025",
    path: "NOTICE/RPH-NTP-R7-Conductors-(PB-ITB-R7-3-2025).jpg",
    url: "https://drive.google.com/file/d/16WyC0r43awv3EOYgNtpThb7KXucW9xXw/view?usp=sharing",
  },
  {
    title: "RPH NOA - R7 Conductors (PB-ITB-R7-3-2025)",
    path: "NOTICE/RPH NOA - R7 Conductors (PB-ITB-R7-3-2025).jpg",
    url: "https://drive.google.com/file/d/1Zv0Uf7uZ9jvBw6h4b4wvI5kI5b6H6h5t/view?usp=drive_link",
  },
  {
    title: "RPH NOA - R7 Steel Poles (PB-ITB-R7-2-2025)",
    path: "NOTICE/RPH NOA - R7 Steel Poles (PB-ITB-R7-2-2025).jpg",
    url: "https://drive.google.com/file/d/1k_f2j561feTXKtNNVCiKZoCN5Y7Hmcb9/view?usp=drive_link",
  },
  {
    title: "RPH NOA - R7 Distribution Transformers (PB-ITB-R7-1-2025)",
    path: "NOTICE/RPH NOA - R7 Distribution Transformers (PB-ITB-R7-1-2025).jpg",
    url: "https://drive.google.com/file/d/1pAWI8tG7HQv8L8n5OTjtSN2ws8a4tsMn/view?usp=drive_link",
  },
  {
    title: "PROCUREMENT OF SUPPLY AND DELIVERY OF STEEL POLES",
    path: "NOTICE/PROCUREMENT-OF-SUPPLY-AND-DELIVERY-OF-STEEL-POLES.jpg",
    url: "https://drive.google.com/file/d/14E2Th73jZ57rK0lrZ0jEFHM9dzlo4EsT/view?usp=sharing",
  },
  {
    title: "PROCUREMENT OF SUPPLY AND DELIVERY OF CONDUCTORS",
    path: "NOTICE/PROCUREMENT-OF-SUPPLY-AND-DELIVERY-OF-CONDUCTORS.jpg",
    url: "https://drive.google.com/file/d/1B3meiu8pKX86zEWZ-kQja2lkx5u8ha4e/view?usp=drive_link",
  },
  {
    title:
      "PROCUREMENT OF CONSIGNMENT SUPPLY AND DELIVERY OF DISTRIBUTION TRANSFORMERS",
    path: "NOTICE/PROCUREMENT-OF-CONSIGNMENT-SUPPLY-AND-DELIVERY-OF-DISTRIBUTION-TRANSFORMERS.jpg",
    url: "https://drive.google.com/file/d/1Avy6LYOUmjAHjwpdaLG1I7lP4cIzjnUh/view?usp=sharing",
  },
  {
    title: "PB-ITB-R7-1-2025",
    path: "NOTICE/PB-ITB-R7-1-2025.jpg",
    url: "https://drive.google.com/file/d/1QauvDKMExDlzyHbEhOhxG8NliK8NcKej/view?usp=drive_link",
  },
  {
    title: "PB-ITB-R7-2-2025",
    path: "NOTICE/PB-ITB-R7-2-2025.jpg",
    url: "https://drive.google.com/file/d/1-p-0XqazTO9Yqbz-PAaQF7KNflCcZbb9/view?usp=drive_link",
  },
  {
    title: "PB-ITB-R7-3-2025",
    path: "NOTICE/PB-ITB-R7-3-2025.jpg",
    url: "https://drive.google.com/file/d/1D9KXNP-IKGNmyWsW1_XpY67OwZuacJQC/view?usp=drive_link",
  },
  {
    title: "NOTICE OF VIRTUAL HEARING",
    path: "NOTICE/Promulgated 0125-2024. NVH 2024-029 CF 26Dec2024.jpg",
    url: "https://drive.google.com/file/d/1xU4C-LvoVZEIUzrsYYxbnsYb1fBfXU42/view?usp=drive_link",
  },
  {
    title: "Notice Of Award",
    path: "NOTICE/Signed NOA - PB-ITB-R7-2-2024 (Rebidding).jpg",
    url: "https://drive.google.com/file/d/1CCtSZz9IbbQ6KF4yJ2dTX0MBaHz0Y_cE/view?usp=drive_link",
  },
];

function Notice() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");

  const filteredNotices = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return noticeData;

    return noticeData.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );
  }, [query]);

  useEffect(() => {
    if (!filteredNotices.length) return;

    if (activeIndex >= filteredNotices.length) {
      setActiveIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % filteredNotices.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [filteredNotices, activeIndex]);

  const handleNext = () => {
    if (!filteredNotices.length) return;
    setActiveIndex((current) => (current + 1) % filteredNotices.length);
  };

  const handlePrevious = () => {
    if (!filteredNotices.length) return;
    setActiveIndex(
      (current) => (current - 1 + filteredNotices.length) % filteredNotices.length
    );
  };

  const activeNotice = filteredNotices[activeIndex];

  return (
    <div className="bg-image2 min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
            Procurement and Public Notices
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Notice Board
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Browse current notices quickly through an auto-sliding preview and a
            searchable notice list.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            {!activeNotice ? (
              <div className="flex h-[360px] items-center justify-center p-6 text-center text-slate-600 sm:h-[520px]">
                No notices match your search.
              </div>
            ) : (
              <>
                <div className="relative">
                  <img
                    src={assetBaseUrl + activeNotice.path}
                    alt={activeNotice.title}
                    draggable={false}
                    className="h-[320px] w-full object-contain bg-slate-100 p-2 sm:h-[520px]"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 text-white sm:p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
                      Auto slide on
                    </p>
                    <h2 className="mt-1 line-clamp-2 text-lg font-bold sm:text-2xl">
                      {activeNotice.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrevious}
                    aria-label="Previous notice"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
                  >
                    <FaChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next notice"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
                  >
                    <FaChevronRight size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-600">
                    Slide {activeIndex + 1} of {filteredNotices.length}
                  </span>
                  <a
                    href={activeNotice.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                  >
                    Open Document
                  </a>
                </div>
              </>
            )}
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg sm:p-5">
            <label className="mb-3 block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Search Notices
              </span>
              <div className="relative">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  type="text"
                  placeholder="Type keyword (e.g. conductors, steel poles)"
                  className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </label>

            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Notice List</span>
              <span>{filteredNotices.length} items</span>
            </div>

            <ul className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
              {filteredNotices.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <li key={item.title + item.path}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        isActive
                          ? "border-amber-400 bg-amber-50"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default Notice;
