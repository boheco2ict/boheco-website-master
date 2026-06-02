import { useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaDownload,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFilePdf,
  FaInfoCircle,
  FaSearch,
} from "react-icons/fa";

const assetBaseUrl =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/";

const planGroups = [
  {
    year: "2025",
    title: "Distribution Development Plan 2025",
    period: "2025-2034",
    previewPath: "ANNEX/BOHECO II 2025-2034 DPP.jpg",
    documents: [
      {
        title: "BOHECO II 2025-2034 DPP",
        type: "Main Plan",
        url: "https://drive.google.com/file/d/1dO2WcXNDrxe4E34n4hiUWvSN-EKanzjf/view?usp=sharing",
      },
      {
        title: "ANNEX-BOHECOII-2025-2034-Grid",
        type: "Annex",
        url: "https://drive.google.com/file/d/1kiv4zLK9FDofUTJgXIMMGVgcnhOpCosL/view?usp=sharing",
      },
    ],
  },
  {
    year: "2024",
    title: "Distribution Development Plan 2024",
    period: "2024-2033",
    previewPath: "ANNEX/BOHECO II 2024-2033 DPP.jpg",
    documents: [
      {
        title: "BOHECO II 2024-2033 DPP",
        type: "Main Plan",
        url: "https://drive.google.com/file/d/1ExUu1-Q0i7BToOoWUaDOIf6QbX5IFM5t/view?usp=drive_link",
      },
      {
        title: "Annex A - BOHECO II 2024-2023 PSPP Main Grid",
        type: "PSPP Annex",
        url: "https://drive.google.com/file/d/1t2logBpOet517D5KnTCL6OGl4larqq9r/view?usp=drive_link",
      },
      {
        title: "Annex B - BOHECO II 2024-2023 PSPP NPC Bilangbilangan",
        type: "PSPP Annex",
        url: "https://drive.google.com/file/d/1atMfL5vHu3GPAZHw8mSKW04qCrX759pg/view?usp=drive_link",
      },
      {
        title: "Annex C - BOHECO II 2024-2023 PSPP NPC Calbul-an",
        type: "PSPP Annex",
        url: "https://drive.google.com/file/d/1tNFik1RAgZKO7ZPuwiOVw6XjL1bkwcwv/view?usp=drive_link",
      },
      {
        title: "Annex D - BOHECO II 2024-2023 PSPP NPC Cataban",
        type: "PSPP Annex",
        url: "https://drive.google.com/file/d/1Jf4HJ4DyLMfz_lfdscwL7UAUdTJKf4nY/view?usp=drive_link",
      },
      {
        title: "Annex E - BOHECO II 2024-2023 PSPP NPC Gaus",
        type: "PSPP Annex",
        url: "https://drive.google.com/file/d/11-_5RHl4ELo5ffOMUVr_Xwd5P0u7wUEZ/view?usp=drive_link",
      },
      {
        title: "Annex F - BOHECO II 2024-2023 PSPP NPC Hingotanan",
        type: "PSPP Annex",
        url: "https://drive.google.com/file/d/1TkgMTBqvBKlDKLldNacAqIH1FCaa4zYp/view?usp=drive_link",
      },
      {
        title: "Annex G - BOHECO II 2024-2023 PSPP NPC Malingin",
        type: "PSPP Annex",
        url: "https://drive.google.com/file/d/1kwG-_YHp4HWI3OqYd0kV2blphyIHrirJ/view?usp=drive_link",
      },
      {
        title: "Annex H - BOHECO II 2024-2023 PSPP NPC Maomawan",
        type: "PSPP Annex",
        url: "https://drive.google.com/file/d/1jjrhQC-7G0VNVyAySJWgws_YPot8Elcc/view?usp=drive_link",
      },
      {
        title: "Annex I - BOHECO II 2024-2023 PSPP NPC Sagasa",
        type: "PSPP Annex",
        url: "https://drive.google.com/file/d/1_LBdI-NE-SilfvFqQHA4Le9i3GjYzA_O/view?usp=drive_link",
      },
    ],
  },
];

function DdpPspp() {
  const [activeYear, setActiveYear] = useState(planGroups[0].year);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return planGroups
      .filter((group) => group.year === activeYear)
      .map((group) => ({
        ...group,
        documents: group.documents.filter((document) =>
          document.title.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.documents.length);
  }, [activeYear, searchTerm]);

  return (
    <div className="bg-image2 min-h-screen px-4 pb-10 pt-28 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="border-b border-slate-200 bg-slate-900 px-5 py-3 text-white sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="w-fit rounded-md bg-amber-300 px-2.5 py-1 text-sm font-bold text-slate-950">
                DDP & PSPP
              </span>
              <span className="text-sm font-medium text-slate-300">
                Showing {activeYear} documents
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                Planning Documents
              </p>
              <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                Distribution Development Plan and PSPP
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Select a year, preview the notice, then open only the related
                DPP or PSPP files you need.
              </p>
            </div>

            <label className="relative block">
              <span className="sr-only">Search DDP and PSPP documents</span>
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search document title"
                className="h-12 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </label>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-24 lg:self-start">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                <FaCalendarAlt className="text-amber-600" />
                Choose a year
              </div>
              <div className="grid gap-2">
                {planGroups.map((group) => {
                  const isActive = activeYear === group.year;

                  return (
                    <button
                      key={group.year}
                      type="button"
                      onClick={() => setActiveYear(group.year)}
                      className={`rounded-lg border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300 hover:bg-amber-50"
                      }`}
                    >
                      <span className="block text-sm font-bold">{group.year}</span>
                      <span
                        className={`mt-1 block text-xs ${
                          isActive ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {group.period} · {group.documents.length} document
                        {group.documents.length === 1 ? "" : "s"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700">
              <div className="flex gap-2">
                <FaInfoCircle className="mt-0.5 flex-none text-amber-700" />
                <p>
                  DDP files show development plans. PSPP annexes list power
                  supply planning details for specific areas or grids.
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            {!filteredGroups.length && (
              <EmptyState message="Try another search term or select a different year." />
            )}

            {filteredGroups.map((group) => (
              <PlanGroup key={group.year} group={group} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function PlanGroup({ group }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-0 xl:grid-cols-[260px_1fr]">
        <div className="border-b border-slate-200 bg-slate-50 p-4 xl:border-b-0 xl:border-r">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img
              src={assetBaseUrl + group.previewPath}
              alt={group.title}
              className="h-44 w-full object-cover object-top"
              draggable={false}
            />
          </div>

          <a
            href={assetBaseUrl + group.previewPath}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <FaExternalLinkAlt size={13} />
            View Notice
          </a>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                {group.period}
              </p>
              <h2 className="text-xl font-bold text-slate-900">{group.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {group.documents.length} related document
                {group.documents.length === 1 ? "" : "s"}
              </p>
            </div>
            <span className="w-fit rounded-md bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
              {group.year}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {group.documents.map((document) => (
              <DocumentCard key={document.title} document={document} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function DocumentCard({ document }) {
  return (
    <a
      href={document.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-amber-300 hover:bg-amber-50/60 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
    >
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-red-50 text-red-600">
        <FaFilePdf size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-bold leading-5 text-slate-900">
          {document.title}
        </p>
        <p className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
          {document.type}
        </p>
      </div>

      <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-slate-100 text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
        <FaDownload size={14} />
      </div>
    </a>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
        <FaFileAlt size={24} />
      </div>
      <h2 className="text-lg font-bold text-slate-900">No documents found</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">{message}</p>
    </div>
  );
}

export default DdpPspp;
