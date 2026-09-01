import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaClipboardList,
  FaFileAlt,
  FaRegFileAlt,
  FaUser,
} from "react-icons/fa";
import Policy from "./Policy";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";

// UI Components
import ProfileTab from "../../components/dashboard/ui/ProfileTab";
import LeaveCreditsTab from "../../components/dashboard/ui/LeaveCreditsTab";
import MemoTab from "../../components/dashboard/ui/MemoTab";
import OfficeOrderTab from "../../components/dashboard/ui/OfficeOrderTab";
import Profile from "../../components/dashboard/ui/Profile";

const tabs = [
  { id: "profile", label: "Profile", icon: FaUser },
  { id: "leave", label: "Leave Credits", icon: FaClipboardList },
  { id: "memo", label: "Memo", icon: FaRegFileAlt },
  { id: "order", label: "Office Order", icon: FaFileAlt },
];

function capitalizeFullName(name) {
  if (!name) return "";

  return name
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Dashboard() {
  const { user, employeeInfo } = useAuth();
  const location = useLocation();
  const [employee, setEmployee] = useState(employeeInfo);
  const [employeeUserId, setEmployeeUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [editError, setEditError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdateResult, setLastUpdateResult] = useState(null);
  const [editData, setEditData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    address: "",
    phone1: "",
    phone2: "",
  });
  const fullName = useMemo(() => {
    const parts = [
      employee?.firstname,
      employee?.middlename,
      employee?.lastname,
    ].filter(Boolean);

    return capitalizeFullName(parts.join(" "));
  }, [employee]);

  const leaveCredits = useMemo(
    () => employee?.employee_leave_balances || [],
    [employee?.employee_leave_balances]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const validTab =
      tab === "coop-policies" || tabs.some((item) => item.id === tab);
    if (validTab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    setIsLoading(false);
  }, [employeeInfo]);

  const handleOpenEdit = useCallback(() => {
    setEditError("");
    setEditData({
      firstname: employee?.firstname || "",
      middlename: employee?.middlename || "",
      lastname: employee?.lastname || "",
      address: employee?.address || "",
      phone1: employee?.phone1 || "",
      phone2: employee?.phone2 || "",
    });
    setIsEditOpen(true);
  }, [employee]);

  const handleEditChange = useCallback((event) => {
    const { name, value } = event.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSaveEdit = useCallback(
    async (event) => {
      event.preventDefault();
      setEditError("");

      setIsSaving(true);

      if (!user?.id) {
        console.error("No authenticated user.");
        setEditError(
          "Unable to identify your account. Please reload and try again."
        );
        setIsSaving(false);
        return;
      }

      // Build payload only with non-empty values to avoid overwriting existing data
      const updatePayload = {};
      const fieldsToUpdate = [
        "firstname",
        "middlename",
        "lastname",
        "address",
        "phone1",
        "phone2",
      ];

      fieldsToUpdate.forEach((field) => {
        const trimmedValue = editData[field].trim();
        if (trimmedValue) {
          updatePayload[field] = trimmedValue;
        }
      });

      // If no fields changed, show a message and return
      if (Object.keys(updatePayload).length === 0) {
        setEditError("Please enter at least one field to update.");
        setIsSaving(false);
        return;
      }

      const { data: updatedData, error: updateError } = await supabase
        .from("employees")
        .update(updatePayload)
        .eq("user_id", user.id)
        .select(
          `
          empnumber,
          firstname,
          middlename,
          lastname,
          department,
          position,
          empstatus,
          address,
          phone1,
          phone2,
          birthdate,
          tin,
          sss,
          pagibig,
          philhealth,
          datehired,
          basicrate,
          riceallowance,
          role,
          user_id
        `
        );

      // record the raw update response for debugging
      setLastUpdateResult({
        updatedData: updatedData ?? null,
        updateError: updateError ?? null,
      });

      if (updateError) {
        console.error(updateError);
        const errMsg =
          updateError.message ||
          "Unable to save profile changes. Please try again.";
        const rlsPattern =
          /permission|policy|row level security|rls|not authorized|permission denied/i;
        if (rlsPattern.test(errMsg)) {
          setEditError(
            "Permission denied while updating profile. Ensure RLS policies allow authenticated users to update their own employee record. See docs/SUPABASE_RLS_INSTRUCTIONS.md"
          );
        } else {
          setEditError(errMsg);
        }
        setIsSaving(false);
        return;
      }

      // Always fetch the latest employee row to ensure the UI reflects DB state
      const { data: refreshedEmployee, error: fetchError } = await supabase
        .from("employees")
        .select(
          `
            empnumber,
            firstname,
            middlename,
            lastname,
            department,
            position,
            empstatus,
            address,
            phone1,
            phone2,
            birthdate,
            tin,
            sss,
            pagibig,
            philhealth,
            datehired,
            basicrate,
            riceallowance,
            role,
            user_id,
            employee_leave_balances (
              leave_type,
              leave_balance
            )
          `
        )
        .eq("user_id", user.id)
        .single();

      // write debug info
      setLastUpdateResult((prev) => ({
        ...prev,
        refreshedEmployee: refreshedEmployee ?? null,
        fetchError: fetchError ?? null,
      }));

      if (fetchError || !refreshedEmployee) {
        console.error(fetchError);
        setEditError(
          fetchError?.message ||
            "Profile update succeeded but we could not refresh the saved data. Please reload the page."
        );
        setIsSaving(false);
        return;
      }

      setEmployee({ ...employee, ...refreshedEmployee });
      setEmployeeUserId(user.id);
      setIsSaving(false);
      setIsEditOpen(false);
    },
    [editData, employee, user?.id]
  );

  return (
    <div
      className="min-h-screen w-full px-4 pb-8 pt-5 sm:px-5"
    >
      <div className="mx-auto w-full max-w-[1600px]">

        {/* =========================================
            DASHBOARD NAVIGATION
        ========================================= */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}
          <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:px-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Employee Portal
            </span>

            <h2 className="text-xl font-bold text-slate-900">
              Dashboard
            </h2>

            <p className="text-sm text-slate-500">
              Access your profile, leave credits, memos, policies, and office orders.
            </p>
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto">
            <div className="flex min-w-max px-3 py-3 sm:px-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group relative flex items-center gap-2.5
                      rounded-xl px-4 py-3
                      text-sm font-semibold
                      transition-all duration-200
                      mx-2
                      ${
                        isActive
                          ? "bg-amber-50 text-amber-800"
                          : "bg-slate-50 text-slate-500 hover:text-slate-800"
                      }
                    `}
                    title={tab.label}
                  >
                    {/* Icon */}
                    <span
                      className={`
                        flex h-8 w-8 items-center justify-center
                        rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-amber-500 text-white shadow-sm"
                            : "bg-slate-200 text-slate-400 group-hover:bg-transparent group-hover:text-slate-600"
                        }
                      `}
                    >
                      <Icon size={15} />
                    </span>

                    {/* Label */}
                    <span>{tab.label}</span>

                    {/* Active Indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================
            CONTENT
        ========================================= */}
        <main className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6 lg:p-8">
            {!isLoading && activeTab === "profile" && (
              <ProfileTab
                employee={employee}
                fullName={fullName}
                onEditClick={handleOpenEdit}
              />
            )}

            {!isLoading && activeTab === "leave" && (
              <LeaveCreditsTab
                leaveCredits={leaveCredits}
                employee={employee}
              />
            )}

            {!isLoading && activeTab === "memo" && (
              <MemoTab employee={employee} />
            )}

            {!isLoading && activeTab === "coop-policies" && <Policy />}

            {!isLoading && activeTab === "order" && (
              <OfficeOrderTab employee={employee} />
            )}
          </div>
        </main>

        {/* =========================================
            PROFILE MODAL
        ========================================= */}
        <Profile
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          editData={editData}
          handleEditChange={handleEditChange}
          handleSaveEdit={handleSaveEdit}
          editError={editError}
          isSaving={isSaving}
        />

        {/* =========================================
            DEVELOPMENT DEBUG
        ========================================= */}
        {false && process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 right-4 z-50 w-96 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-lg">
            <div className="mb-2 text-sm font-semibold">
              Debug
            </div>

            <div>
              <strong>auth user id:</strong>{" "}
              {employeeUserId || "(none)"}
            </div>

            <div>
              <strong>employee.user_id:</strong>{" "}
              {employee?.user_id || "(none)"}
            </div>

            <div className="mt-2">
              <strong>editData:</strong>

              <pre className="whitespace-pre-wrap">
                {JSON.stringify(editData, null, 2)}
              </pre>
            </div>

            <div className="mt-2">
              <strong>lastUpdateResult:</strong>

              <pre className="whitespace-pre-wrap">
                {JSON.stringify(lastUpdateResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
