
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaClipboardList,
  FaCog,
  FaEdit,
  FaFileAlt,
  FaRegFileAlt,
  FaUser,
} from "react-icons/fa";
import Policy from "../Policy";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";

const tabs = [
  { id: "profile", label: "Profile", icon: FaUser },
  { id: "leave", label: "Leave Credits", icon: FaClipboardList },
  { id: "memo", label: "Memo", icon: FaRegFileAlt },
  { id: "order", label: "Office Order", icon: FaFileAlt },
];

const profileFields = [
  { label: "Employee Number", key: "empnumber" },
  { label: "Department", key: "department" },
  { label: "Position", key: "position" },
  { label: "Status", key: "empstatus" },
  { label: "Address", key: "address", wide: true, editable: true },
  { label: "Mobile Number", key: "phone1", type: "mobile", editable: true },
  { label: "Telephone Number", key: "phone2", editable: true },
  { label: "Birthdate", key: "birthdate", type: "date" },
  { label: "TIN", key: "tin" },
  { label: "SSS", key: "sss" },
  { label: "Pag-IBIG", key: "pagibig" },
  { label: "PhilHealth", key: "philhealth" },
  { label: "Date Hired", key: "datehired", type: "date" },
  { label: "Basic Rate", key: "basicrate", type: "money", highlight: true },
  { label: "Rice Allowance", key: "riceallowance", type: "money" },
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

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "N/A";

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

function formatMobile(value) {
  if (!value) return "N/A";

  const phone = String(value).trim();
  if (!phone) return "N/A";

  return phone.startsWith("+63") ? phone : `+63 ${phone}`;
}

function formatValue(employee, field) {
  const value = employee?.[field.key];

  if (field.type === "date") return formatDate(value);
  if (field.type === "money") return formatMoney(value);
  if (field.type === "mobile") return formatMobile(value);

  return value || "N/A";
}

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [employee, setEmployee] = useState(null);
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
  const [memoMode, setMemoMode] = useState("view");
  const [memoName, setMemoName] = useState("");
  const [memoUrl, setMemoUrl] = useState("");
  const [recipientType, setRecipientType] = useState("employee");
  const [employeeTarget, setEmployeeTarget] = useState("");
  const [batchTarget, setBatchTarget] = useState("all");
  const [memoMessage, setMemoMessage] = useState("");
  const [recipientMemos, setRecipientMemos] = useState([]);
  const [isMemoLoading, setIsMemoLoading] = useState(false);

  const fullName = useMemo(() => {
    const parts = [
      employee?.firstname,
      employee?.middlename,
      employee?.lastname,
    ].filter(Boolean);

    return capitalizeFullName(parts.join(" "));
  }, [employee]);

  const leaveCredits = useMemo(() => employee?.employee_ledger || [], [employee?.employee_ledger]);

  const isAdmin = useMemo(
    () =>
      (employee?.role &&
        ["admin", "administrator", "admin_user"].includes(String(employee.role).toLowerCase())) ||
      (employee?.position && String(employee.position).toLowerCase().includes("admin")),
    [employee?.role, employee?.position]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const validTab = tab === "coop-policies" || tabs.some((item) => item.id === tab);
    if (validTab) {
      setActiveTab(tab);
    }

  }, [location.search]);

  useEffect(() => {
    let isMounted = true;

    if (authLoading) {
      return;
    }

    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("employees")
        .select(
          `
          id,
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
          employee_ledger (
            leave_type,
            leave_balance
          )
        `
        )
        .eq("user_id", user.id)
        .single();

      if (!isMounted) return;

      if (error) {
        console.error(error);
      } else {
        setEmployee(data);
        setEmployeeUserId(user.id);
      }

      setIsLoading(false);
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  const fetchRecipientMemos = useCallback(async () => {
    if (!employee?.id) return;

    setIsMemoLoading(true);

    const { data, error } = await supabase
      .from("memo_recipients")
      .select("id, is_read, memo(id, title, url, created_at)")
      .eq("employee_id", employee.id);

    if (error) {
      console.error("Failed to fetch recipient memos:", error);
      setRecipientMemos([]);
    } else {
      setRecipientMemos(data || []);
    }

    setIsMemoLoading(false);
  }, [employee?.id]);

  useEffect(() => {
    if (activeTab !== "memo" || !employee?.id) return;
    fetchRecipientMemos();
  }, [activeTab, employee?.id, fetchRecipientMemos]);

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
      setEditError("Unable to identify your account. Please reload and try again.");
      setIsSaving(false);
      return;
    }

    // Build payload only with non-empty values to avoid overwriting existing data
    const updatePayload = {};
    const fieldsToUpdate = ["firstname", "middlename", "lastname", "address", "phone1", "phone2"];
    
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
    setLastUpdateResult({ updatedData: updatedData ?? null, updateError: updateError ?? null });

    if (updateError) {
      console.error(updateError);
      const errMsg = updateError.message || "Unable to save profile changes. Please try again.";
      const rlsPattern = /permission|policy|row level security|rls|not authorized|permission denied/i;
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
            employee_ledger (
              leave_type,
              leave_balance
            )
          `
      )
      .eq("user_id", user.id)
      .single();

    // write debug info
    setLastUpdateResult((prev) => ({ ...prev, refreshedEmployee: refreshedEmployee ?? null, fetchError: fetchError ?? null }));

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
  }, [editData, employee, user?.id]);

  const canSendMemo = useMemo(
    () =>
      memoName.trim().length > 0 &&
      memoUrl.trim().length > 0 &&
      (recipientType !== "employee" || employeeTarget.trim().length > 0),
    [memoName, memoUrl, recipientType, employeeTarget]
  );

  const resetMemoForm = useCallback(() => {
    setMemoName("");
    setMemoUrl("");
    setRecipientType("employee");
    setEmployeeTarget("");
    setBatchTarget("all");
    setMemoMessage("");
  }, []);

  const handleSendMemo = useCallback(
    async (event) => {
      event.preventDefault();

      if (!canSendMemo) return;

      try {
        let targetEmployee = null;

        if (recipientType === "employee") {
          const { data: employeeData, error: employeeError } = await supabase
            .from("employees")
            .select("id, empnumber")
            .eq("empnumber", employeeTarget.trim())
            .maybeSingle();

          if (employeeError) {
            console.error("employee lookup failed:", employeeError);
            setMemoMessage("Unable to look up employee. Please try again.");
            return;
          }

          if (!employeeData) {
            setMemoMessage("Employee not found.");
            return;
          }

          targetEmployee = employeeData;

          if (!targetEmployee?.id) {
            setMemoMessage("Employee record has no valid ID.");
            return;
          }
        }

        const { data: memoData, error: memoError } = await supabase
          .from("memo")
          .insert({
            title: memoName.trim(),
            url: memoUrl.trim(),
          })
          .select()
          .single();

        if (memoError || !memoData) {
          console.error(memoError);
          setMemoMessage("Failed to save memo.");
          return;
        }

        if (recipientType === "employee") {
          const { error: recipientError } = await supabase
            .from("memo_recipients")
            .insert({
              memo_id: memoData.id,
              employee_id: targetEmployee.id,
              is_read: false,
            });

          if (recipientError) {
            console.error(recipientError);
            setMemoMessage("Memo saved, but recipient assignment failed.");
            return;
          }
        }

        const recipient =
          recipientType === "employee"
            ? `Employee ${employeeTarget.trim()}`
            : batchTarget === "all"
            ? "All employees"
            : batchTarget;

        setMemoMessage(`Memo "${memoName.trim()}" sent to ${recipient}.`);
        setMemoMode("view");
        resetMemoForm();

        if (recipientType === "employee" && targetEmployee?.id === employee?.id) {
          fetchRecipientMemos();
        }
      } catch (error) {
        console.error(error);
        setMemoMessage("An unexpected error occurred.");
      }
    },
    [canSendMemo, memoName, memoUrl, recipientType, employeeTarget, batchTarget, fetchRecipientMemos, employee, resetMemoForm]
  );

  return (
    <>
          {/* top stripe removed to let navigation handle header background */}

      <div className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:px-10 xl:pl-[240px] xl:pt-20" style={{ background: 'var(--section-bg)' }}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">

          {/* Main Content */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          {/* Tab Navigation */}
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Dashboard Sections</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                        isActive
                          ? "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-900 shadow-md"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                      title={tab.label}
                    >
                      {/* Icon Container */}
                      <span
                        className={`flex items-center justify-center rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-amber-200 text-amber-700"
                            : "bg-slate-200 text-slate-500 group-hover:bg-slate-300"
                        }`}
                        style={{ width: "32px", height: "32px" }}
                      >
                        <Icon size={16} />
                      </span>

                      {/* Label */}
                      <span className="text-center leading-tight">{tab.label}</span>

                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-xl bg-gradient-to-r from-amber-400 to-amber-500"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 themed-bg-card themed-text">
            {isLoading && <DashboardLoading />}

            {!isLoading && activeTab === "profile" && (
              <ProfileTab
                employee={employee}
                fullName={fullName}
                onEditClick={handleOpenEdit}
              />
            )}

            {!isLoading && activeTab === "leave" && (
              <LeaveCreditsTab leaveCredits={leaveCredits} />
            )}

            {!isLoading && activeTab === "memo" && (
              <MemoTab
                isAdmin={isAdmin}
                memoMode={memoMode}
                setMemoMode={setMemoMode}
                memoName={memoName}
                setMemoName={setMemoName}
                memoUrl={memoUrl}
                setMemoUrl={setMemoUrl}
                recipientType={recipientType}
                setRecipientType={setRecipientType}
                employeeTarget={employeeTarget}
                setEmployeeTarget={setEmployeeTarget}
                batchTarget={batchTarget}
                setBatchTarget={setBatchTarget}
                memoMessage={memoMessage}
                setMemoMessage={setMemoMessage}
                recipientMemos={recipientMemos}
                isMemoLoading={isMemoLoading}
                onSendMemo={handleSendMemo}
                onCancelMemo={() => {
                  resetMemoForm();
                  setMemoMode("view");
                }}
                canSendMemo={canSendMemo}
              />
            )}

            {!isLoading && activeTab === "coop-policies" && <Policy />}

            {!isLoading && activeTab === "order" && (
              <EmptyState
                icon={FaFileAlt}
                title="No office order posted"
                message="Office orders assigned to you will be shown in this section."
              />
            )}
          </div>
        </section>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.5)', padding: '1.5rem' }}>
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl themed-bg-card" style={{ border: '1px solid var(--muted)' }}>
            <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between themed-bg-section themed-border">
              <div>
                <h3 className="text-lg font-semibold themed-text">Edit Profile</h3>
                <p className="text-sm themed-muted">
                  Update your full name, address, and phone numbers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-md border px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
                style={{ borderColor: 'var(--muted)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 p-6 themed-bg-card themed-text">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold themed-muted">First Name</label>
                  <input
                    name="firstname"
                    value={editData.firstname}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: '1px solid var(--muted)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold themed-muted">Middle Name</label>
                  <input
                    name="middlename"
                    value={editData.middlename}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: '1px solid var(--muted)' }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold themed-muted">Last Name</label>
                  <input
                    name="lastname"
                    value={editData.lastname}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: '1px solid var(--muted)' }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold" style={{ color: 'var(--muted)' }}>Address</label>
                  <input
                    name="address"
                    value={editData.address}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ border: '1px solid var(--muted)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold themed-muted">Mobile Number</label>
                  <input
                    name="phone1"
                    value={editData.phone1}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: '1px solid var(--muted)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold themed-muted">Telephone Number</label>
                  <input
                    name="phone2"
                    value={editData.phone2}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: '1px solid var(--muted)' }}
                  />
                </div>
              </div>

              {editError && (
                <div className="rounded-md px-4 py-3 text-sm" style={{ border: '1px solid var(--muted)', background: '#fff6f6', color: '#7f1d1d' }}>
                  {editError}
                </div>
              )}

              <div className="flex flex-col gap-3 themed-border pt-4 sm:flex-row sm:justify-end" style={{ borderTopStyle: 'solid' }}>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition hover:bg-slate-100"
                  style={{ border: '1px solid var(--muted)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ opacity: isSaving ? 0.7 : 1 }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {false && process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 w-96 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-lg">
          <div className="mb-2 font-semibold text-sm">Debug</div>
          <div>
            <strong>auth user id:</strong> {employeeUserId || "(none)"}
          </div>
          <div>
            <strong>employee.user_id:</strong> {employee?.user_id || "(none)"}
          </div>
          <div className="mt-2">
            <strong>editData:</strong>
            <pre className="whitespace-pre-wrap">{JSON.stringify(editData, null, 2)}</pre>
          </div>
          <div className="mt-2">
            <strong>lastUpdateResult:</strong>
            <pre className="whitespace-pre-wrap">{JSON.stringify(lastUpdateResult, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

function ProfileTab({ employee, fullName, onEditClick }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.6fr_auto]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Employee profile</p>
            <h2 className="text-3xl font-semibold text-slate-900">
              {fullName || "Employee"}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Review your profile information, verify personal details, and update contact fields when needed.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge icon={FaBriefcase} text={employee?.position || "Position N/A"} />
            <Badge icon={FaCalendarAlt} text={`Hired ${formatDate(employee?.datehired)}`} />
            <Badge icon={FaUser} text={employee?.empstatus || "Status N/A"} />
          </div>
        </div>

        <div className="flex flex-col gap-3 items-start justify-start lg:flex-row lg:items-center lg:justify-between">
          <button
            type="button"
            onClick={() => navigate("/reset-password")}
            title="Open settings"
            aria-label="Open settings"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <FaCog className="mr-2 h-4 w-4 text-slate-500" />
            Settings
          </button>
          <button
            type="button"
            onClick={onEditClick}
            title="Edit profile"
            aria-label="Edit profile"
            className="inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            <FaEdit className="mr-2 h-4 w-4" />
            Edit profile
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profileFields.map((field) => (
          <InfoCard
            key={field.label}
            label={field.label}
            value={formatValue(employee, field)}
            wide={field.wide}
            highlight={field.highlight}
          />
        ))}
      </div>
    </div>
  );
}

function InfoCard({ label, value, wide, highlight, onEdit }) {
  return (
    <div
      className={`rounded-[1.5rem] border border-slate-200 p-5 shadow-sm ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`}
      style={{ background: 'var(--card-bg)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            title={`Edit ${label}`}
            aria-label={`Edit ${label}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <FaEdit className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className={`mt-3 break-words text-base font-semibold ${highlight ? 'text-emerald-700' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  );
}

function Badge({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
      <Icon className="text-amber-500" />
      {text}
    </span>
  );
}

function MemoTab({
  isAdmin,
  memoMode,
  setMemoMode,
  memoName,
  setMemoName,
  memoUrl,
  setMemoUrl,
  recipientType,
  setRecipientType,
  employeeTarget,
  setEmployeeTarget,
  batchTarget,
  setBatchTarget,
  memoMessage,
  recipientMemos,
  isMemoLoading,
  onSendMemo,
  onCancelMemo,
  canSendMemo,
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Memos</p>
            <h2 className="text-2xl font-semibold text-slate-900">Employee Memo Management</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Paste a Google Drive memo image URL, then choose a specific employee or a batch to send.
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setMemoMode("add")}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Add Memo
            </button>
          )}
        </div>
      </div>

      {memoMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {memoMessage}
        </div>
      )}

      {memoMode === "add" && !isAdmin ? (
        <EmptyState
          icon={FaRegFileAlt}
          title="Access denied"
          message="Only administrators can add memos."
        />
      ) : memoMode === "add" ? (
        <form onSubmit={onSendMemo} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Memo Name
              </label>
              <input
                type="text"
                value={memoName}
                onChange={(event) => setMemoName(event.target.value)}
                placeholder="Enter memo name"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Memo Image URL
              </label>
              <input
                type="url"
                value={memoUrl}
                onChange={(event) => setMemoUrl(event.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Send memo to</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300">
                  <input
                    type="radio"
                    checked={recipientType === "employee"}
                    onChange={() => setRecipientType("employee")}
                    className="h-4 w-4"
                  />
                  Specific employee
                </label>
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300">
                  <input
                    type="radio"
                    checked={recipientType === "batch"}
                    onChange={() => setRecipientType("batch")}
                    className="h-4 w-4"
                  />
                  Batch send
                </label>
              </div>

              {recipientType === "employee" ? (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700">Employee Number</label>
                  <input
                    type="text"
                    value={employeeTarget}
                    onChange={(event) => setEmployeeTarget(event.target.value.replace(/\D/g, ""))}
                    placeholder="Enter employee number"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Batch target
                  </label>
                  <select
                    value={batchTarget}
                    onChange={(event) => setBatchTarget(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="all">All employees</option>
                    <option value="management">Management team</option>
                    <option value="support">Support staff</option>
                    <option value="field">Field staff</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancelMemo}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSendMemo}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-amber-700"
            >
              Send memo
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Assigned memos</h3>
              <p className="text-sm text-slate-600">
                View memos assigned to you here.
              </p>
            </div>
            {isMemoLoading && (
              <span className="text-sm text-slate-500">Loading memos…</span>
            )}
          </div>

          {isMemoLoading ? (
            <div className="mt-6 grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : recipientMemos.length > 0 ? (
            <div className="mt-6 space-y-3">
              {recipientMemos.map((item) => {
                const memo = item.memo || {};
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium themed-muted">Memo name</p>
                        <p className="text-base font-semibold themed-text">
                          {memo.title || "Untitled memo"}
                        </p>
                      </div>
                      <a
                        href={memo.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                      >
                        View memo
                      </a>
                    </div>
                    {memo.created_at && (
                      <p className="mt-3 text-sm text-slate-500">
                        Posted {formatDate(memo.created_at)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={FaRegFileAlt}
              title="No memos assigned"
              message="Memos sent to you will appear here."
            />
          )}
        </div>
      )}
    </div>
  );
}

function LeaveCreditsTab({ leaveCredits }) {
  if (!leaveCredits.length) {
    return (
      <EmptyState
        icon={FaClipboardList}
        title="No leave credits found"
        message="Your leave balances will appear here after they are recorded."
      />
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {leaveCredits.map((ledger, index) => (
        <div
          key={`${ledger.leave_type}-${index}`}
          className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:shadow-md"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">Leave Type</p>
            <p className="truncate text-lg font-bold text-slate-900">
              {ledger.leave_type || "Leave"}
            </p>
          </div>
          <div className="flex h-16 w-16 flex-none flex-col items-center justify-center rounded-lg bg-amber-50 text-center">
            <span className="text-xl font-bold text-slate-900">
              {ledger.leave_balance ?? 0}
            </span>
            <span className="text-xs font-medium text-amber-700">Balance</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
        />
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
        <Icon size={24} />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">{message}</p>
    </div>
  );
}

export default Dashboard;
