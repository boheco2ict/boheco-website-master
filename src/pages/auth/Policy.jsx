import { useEffect, useMemo, useState } from "react";
import {
  FaDownload,
  FaExclamationCircle,
  FaFilePdf,
  FaFolderOpen,
  FaSearch,
} from "react-icons/fa";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";

const OLD_POLICIES_GROUP = "Compilation of Old Policies";

const DEFAULT_POLICY_DOCUMENTS = [
  {
    id: "fallback-1",
    title: "BOHECO II Cooperative Constitution",
    group: "General Policies",
    url: "/coop-policies/boheco-cooperative-constitution.txt",
  },
  {
    id: "fallback-2",
    title: "Membership Rights and Responsibilities",
    group: "General Policies",
    url: "/coop-policies/membership-rights-and-responsibilities.txt",
  },
  {
    id: "fallback-3",
    title: "Governance and Operations Policy",
    group: "General Policies",
    url: "/coop-policies/governance-and-operations.txt",
  },
];

function getGroupSortValue(group) {
  const normalizedGroup = String(group || "").trim();

  if (normalizedGroup === OLD_POLICIES_GROUP) return Number.MIN_SAFE_INTEGER;
  if (/^\d{4}$/.test(normalizedGroup)) return Number(normalizedGroup);

  return null;
}

function comparePolicyGroups(aGroup, bGroup) {
  const normalizedA = String(aGroup || "").trim();
  const normalizedB = String(bGroup || "").trim();

  if (normalizedA === OLD_POLICIES_GROUP && normalizedB !== OLD_POLICIES_GROUP)
    return 1;
  if (normalizedB === OLD_POLICIES_GROUP && normalizedA !== OLD_POLICIES_GROUP)
    return -1;

  const orderA = getGroupSortValue(normalizedA);
  const orderB = getGroupSortValue(normalizedB);
  const isYearA = orderA !== null;
  const isYearB = orderB !== null;

  if (isYearA && isYearB) return orderB - orderA;
  if (isYearA) return -1;
  if (isYearB) return 1;

  return normalizedA.localeCompare(normalizedB);
}

function sortPolicies(data) {
  return [...data].sort((a, b) => {
    const aGroup = a.group || "";
    const bGroup = b.group || "";

    const groupComparison = comparePolicyGroups(aGroup, bGroup);
    if (groupComparison !== 0) return groupComparison;

    return (a.title || "").localeCompare(b.title || "");
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
  const { user, loading: authLoading } = useAuth();
  const [policyData, setPolicyData] = useState([]);
  const [activeGroup, setActiveGroup] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLoading(false);
      setErrorMessage(
        "Coop Policies are restricted to signed-in users. Please log in to view the full policy list."
      );
      setPolicyData(DEFAULT_POLICY_DOCUMENTS);
      return;
    }

    const loadPolicies = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("policy")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Policy fetch error:", error);
        setErrorMessage(
          "We could not load the cooperative policies from the server, showing sample policy documents instead."
        );
        setPolicyData(sortPolicies(DEFAULT_POLICY_DOCUMENTS));
        setIsLoading(false);
        return;
      }

      if (!data || !data.length) {
        setErrorMessage(
          "No cooperative policy entries were found in the database. Please verify your Supabase RLS settings or sign in again."
        );
      }

      setPolicyData(
        sortPolicies(data && data.length ? data : DEFAULT_POLICY_DOCUMENTS)
      );
      setIsLoading(false);
    };

    loadPolicies();
  }, [authLoading, user]);

  const policyGroups = useMemo(() => groupPolicies(policyData), [policyData]);
  const groupNames = useMemo(() => {
    return Object.keys(policyGroups).sort((a, b) => comparePolicyGroups(a, b));
  }, [policyGroups]);

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return groupNames.reduce((result, group) => {
      if (activeGroup !== "All" && group !== activeGroup) return result;

      const policies = (policyGroups[group] || []).filter((policy) =>
        policy.title?.toLowerCase().includes(query)
      );

      if (policies.length) {
        result[group] = policies;
      }

      return result;
    }, {});
  }, [activeGroup, groupNames, policyGroups, searchTerm]);

  const visibleGroupNames = groupNames.filter(
    (group) => filteredGroups[group]?.length
  );
  const filteredCount = visibleGroupNames.reduce(
    (count, group) => count + (filteredGroups[group]?.length || 0),
    0
  );
  const totalPolicies = policyData.length;

  return (
    <div className="bg-slate-50 min-h-screen px-4 pb-10 pt-28 sm:px-6 lg:px-10">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                Coop Policies
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Access the cooperative policies you need with confidence.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600">
                  Browse the latest policy documents, filter by category, or
                  search by title to find the right governance guide quickly.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">
                    Total documents
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {totalPolicies}
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
                Find the policy you need.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use search and group filters to narrow down the cooperative
                policies instantly.
              </p>

              <label className="relative mt-6 block">
                <span className="sr-only">Search policies</span>
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search policy title"
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
                  aria-label="Filter policies by group"
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
                Policy results
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
                policies={filteredGroups[group] || []}
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
          <PolicyCard
            key={policy.id || policy.url || policy.title}
            policy={policy}
          />
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
      aria-label={`Open policy document: ${policy.title || "Untitled policy"}`}
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
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {message}
      </p>
    </div>
  );
}

export default Policy;
