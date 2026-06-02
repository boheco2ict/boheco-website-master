import { useEffect, useMemo, useState } from "react";
import {
  FaDownload,
  FaExclamationCircle,
  FaFilePdf,
  FaFolderOpen,
  FaSearch,
} from "react-icons/fa";
import { supabase } from "../supabase";

const OLD_POLICIES_GROUP = "Compilation of Old Policies";

function sortPolicies(data) {
  return [...data].sort((a, b) => {
    if (a.group === OLD_POLICIES_GROUP) return 1;
    if (b.group === OLD_POLICIES_GROUP) return -1;

    return Number(b.group) - Number(a.group);
  });
}

function groupPolicies(data) {
  return data.reduce((groups, policy) => {
    const group = policy.group || "Uncategorized";

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(policy);
    return groups;
  }, {});
}

function Policy() {
  const [policyData, setPolicyData] = useState([]);
  const [activeGroup, setActiveGroup] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPolicies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("policy")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage("We could not load the cooperative policies right now.");
      setIsLoading(false);
      return;
    }

    setPolicyData(sortPolicies(data || []));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const policyGroups = useMemo(() => groupPolicies(policyData), [policyData]);
  const groupNames = useMemo(() => Object.keys(policyGroups), [policyGroups]);

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return groupNames.reduce((result, group) => {
      if (activeGroup !== "All" && group !== activeGroup) return result;

      const policies = policyGroups[group].filter((policy) =>
        policy.title?.toLowerCase().includes(query)
      );

      if (policies.length) {
        result[group] = policies;
      }

      return result;
    }, {});
  }, [activeGroup, groupNames, policyGroups, searchTerm]);

  const visibleGroupNames = Object.keys(filteredGroups);
  const totalPolicies = policyData.length;

  return (
    <div className="bg-image2 min-h-screen px-4 pb-10 pt-28 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="border-b border-slate-200 bg-slate-900 px-5 py-3 text-white sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="rounded-md bg-amber-300 px-2.5 py-1 font-bold text-slate-950">
                  Coop Policies
                </span>
                <span className="text-slate-300">
                  {totalPolicies} document{totalPolicies === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                Cooperative Document Library
              </p>
              <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                Find policies faster
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Browse policy documents by year or use search to quickly locate
                a specific title.
              </p>
            </div>

            <label className="relative block">
              <span className="sr-only">Search policies</span>
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search policy title"
                className="h-12 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </label>
          </div>
        </section>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <FaExclamationCircle className="mt-0.5 flex-none" />
            <span>{errorMessage}</span>
          </div>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FaFolderOpen className="text-amber-600" />
              <span>Filter by group</span>
            </div>

            <select
              value={activeGroup}
              onChange={(event) => setActiveGroup(event.target.value)}
              className="h-10 w-full min-w-0 rounded-md border border-slate-300 bg-white px-2.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              aria-label="Filter policies by group"
            >
              {['All', ...groupNames].map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-4">
          {isLoading && <PolicyLoading />}

          {!isLoading && !visibleGroupNames.length && (
            <EmptyPolicyState
              title="No policies found"
              message="Try a different search term or select another group."
            />
          )}

          {!isLoading &&
            visibleGroupNames.map((group) => (
              <PolicyGroup
                key={group}
                group={group}
                policies={filteredGroups[group]}
              />
            ))}
        </section>
      </main>
    </div>
  );
}

function PolicyGroup({ group, policies }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{group}</h2>
          <p className="text-sm text-slate-500">
            {policies.length} policy document{policies.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2">
        {policies.map((policy) => (
          <PolicyCard key={policy.id || policy.url || policy.title} policy={policy} />
        ))}
      </div>
    </div>
  );
}

function PolicyCard({ policy }) {
  return (
    <a
      href={policy.url}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-[92px] items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-amber-300 hover:bg-amber-50/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
    >
      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-red-50 text-red-600">
        <FaFilePdf size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-bold leading-5 text-slate-900">
          {policy.title || "Untitled policy"}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Open policy document
        </p>
      </div>

      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-slate-100 text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
        <FaDownload size={14} />
      </div>
    </a>
  );
}

function PolicyLoading() {
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

function EmptyPolicyState({ title, message }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
        <FaFolderOpen size={24} />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">{message}</p>
    </div>
  );
}

export default Policy;
