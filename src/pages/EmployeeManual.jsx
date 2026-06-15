import { useEffect, useMemo, useState } from "react";
import {
  FaDownload,
  FaExclamationCircle,
  FaFilePdf,
  FaFolderOpen,
  FaSearch,
} from "react-icons/fa";
import { supabase } from "../supabase";

function sortManuals(data) {
  return [...data].sort((a, b) => {
    const aGroup = String(a.group || "").trim();
    const bGroup = String(b.group || "").trim();
    const groupComparison = aGroup.localeCompare(bGroup);

    if (groupComparison !== 0) return groupComparison;

    return String(a.title || "").localeCompare(String(b.title || ""));
  });
}

function groupManuals(data) {
  return data.reduce((groups, manual) => {
    const group = String(manual.group || "General").trim() || "General";

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(manual);
    return groups;
  }, {});
}

function EmployeeManualPage() {
  const [manualData, setManualData] = useState([]);
  const [activeGroup, setActiveGroup] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadManuals = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("employee_manual")
        .select("id, title, url, created_at, group")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Employee manual fetch error:", error);
        setErrorMessage(
          "We could not load the employee manual from the server. Please try again later.",
        );
        setManualData([]);
        setIsLoading(false);
        return;
      }

      const safeData = Array.isArray(data) ? data : [];

      setManualData(sortManuals(safeData));
      setIsLoading(false);
    };

    loadManuals();
  }, []);

  const manualGroups = useMemo(() => groupManuals(manualData), [manualData]);
  const groupNames = useMemo(() => {
    return Object.keys(manualGroups).sort((a, b) => a.localeCompare(b));
  }, [manualGroups]);

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return groupNames.reduce((result, group) => {
      if (activeGroup !== "All" && group !== activeGroup) return result;

      const manuals = (manualGroups[group] || []).filter((manual) => {
        const haystack = `${manual.title || ""} ${
          manual.group || ""
        }`.toLowerCase();
        return haystack.includes(query);
      });

      if (manuals.length) {
        result[group] = manuals;
      }

      return result;
    }, {});
  }, [activeGroup, groupNames, manualGroups, searchTerm]);

  const visibleGroupNames = groupNames.filter(
    (group) => filteredGroups[group]?.length,
  );
  const filteredCount = visibleGroupNames.reduce(
    (count, group) => count + (filteredGroups[group]?.length || 0),
    0,
  );
  const totalDocuments = manualData.length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-10 pt-28 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                Employee Manual
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Access the employee manual documents you need.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600">
                  Browse the latest employee manual files, filter by section, or
                  search by title to find the right reference quickly.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">
                    Total documents
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {totalDocuments}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">
                    Current view
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {filteredCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                Search & filter
              </p>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">
                Find the manual you need.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use search and group filters to narrow down the employee manual
                documents instantly.
              </p>

              <label className="relative mt-6 block">
                <span className="sr-only">Search employee manuals</span>
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search manual title"
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </label>

              <div className="mt-5">
                <label className="mb-2 inline-block text-sm font-semibold text-slate-700">
                  Filter by group
                </label>
                <select
                  value={activeGroup}
                  onChange={(event) => setActiveGroup(event.target.value)}
                  className="mt-2 h-12 w-full min-w-0 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  aria-label="Filter manuals by group"
                >
                  {["All", ...groupNames].map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <FaExclamationCircle className="mt-0.5 flex-none" />
            <span>{errorMessage}</span>
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Manual results
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredCount}{" "}
                {filteredCount === 1 ? "document" : "documents"} across{" "}
                {visibleGroupNames.length}{" "}
                {visibleGroupNames.length === 1 ? "group" : "groups"}.
              </p>
            </div>
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                {activeGroup === "All" ? "All groups" : activeGroup}
              </span>
              {activeGroup !== "All" && (
                <button
                  type="button"
                  onClick={() => setActiveGroup("All")}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {isLoading && <ManualLoading />}

          {!isLoading && !visibleGroupNames.length && (
            <EmptyManualState
              title="No manuals found"
              message="Try a different search term or select another group."
            />
          )}

          {!isLoading &&
            visibleGroupNames.map((group) => (
              <ManualGroup
                key={group}
                group={group}
                manuals={filteredGroups[group] || []}
              />
            ))}
        </section>
      </main>
    </div>
  );
}

function ManualGroup({ group, manuals }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{group}</h2>
          <p className="text-sm text-slate-500">
            {manuals.length} document{manuals.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2">
        {manuals.map((manual) => (
          <ManualCard
            key={manual.id || manual.url || manual.title}
            manual={manual}
          />
        ))}
      </div>
    </div>
  );
}

function ManualCard({ manual }) {
  return (
    <a
      href={manual.url || "#"}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open employee manual: ${manual.title || "Untitled manual"}`}
      className="group flex min-h-[92px] items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-amber-300 hover:bg-amber-50/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
    >
      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-red-50 text-red-600">
        <FaFilePdf size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-bold leading-5 text-slate-900">
          {manual.title || "Untitled manual"}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Open employee manual document
        </p>
      </div>

      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-slate-100 text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
        <FaDownload size={14} />
      </div>
    </a>
  );
}

function ManualLoading() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div
          key={groupIndex}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <div className="h-16 animate-pulse bg-slate-100" />
          <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((__, itemIndex) => (
              <div
                key={itemIndex}
                className="h-24 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyManualState({ title, message }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
        <FaFolderOpen size={24} />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {message}
      </p>
    </div>
  );
}

export default EmployeeManualPage;
