import { useEffect, useMemo, useState } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaClipboardList,
  FaEdit,
  FaFileAlt,
  FaIdBadge,
  FaInfoCircle,
  FaRegFileAlt,
  FaUser,
} from "react-icons/fa";
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
  const [employee, setEmployee] = useState(null);
  const [employeeUserId, setEmployeeUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
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
  const [show, setShow] = useState(false);
  const [memoMode, setMemoMode] = useState("view");
  const [memoName, setMemoName] = useState("");
  const [memoUrl, setMemoUrl] = useState("");
  const [recipientType, setRecipientType] = useState("employee");
  const [employeeTarget, setEmployeeTarget] = useState("");
  const [batchTarget, setBatchTarget] = useState("all");
  const [memoMessage, setMemoMessage] = useState("");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const fullName = useMemo(() => {
    const parts = [
      employee?.firstname,
      employee?.middlename,
      employee?.lastname,
    ].filter(Boolean);

    return capitalizeFullName(parts.join(" "));
  }, [employee]);

  const firstName = capitalizeFullName(employee?.firstname) || "Employee";
  const leaveCredits = employee?.employee_ledger || [];
  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-PH", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    []
  );

  useEffect(() => {
    let isMounted = true;

    if (authLoading) {
      return;
    }

    if (!user) {
      setErrorMessage("No active user session was found.");
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
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

      if (!isMounted) return;

      if (error) {
        console.error(error);
        setErrorMessage("We could not load your employee record right now.");
      } else {
        setEmployee(data);
        setEmployeeUserId(user.id);
      }

      setIsLoading(false);
    };

    setShow(true);
    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  const handleOpenEdit = () => {
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
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (event) => {
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

    let updatedEmployee = Array.isArray(updatedData) ? updatedData[0] : updatedData;

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
  };

  const canSendMemo =
    memoName.trim().length > 0 &&
    memoUrl.trim().length > 0 &&
    (recipientType !== "employee" || employeeTarget.trim().length > 0);

  const resetMemoForm = () => {
    setMemoName("");
    setMemoUrl("");
    setRecipientType("employee");
    setEmployeeTarget("");
    setBatchTarget("all");
    setMemoMessage("");
  };

  const handleSendMemo = (event) => {
    event.preventDefault();

    if (!canSendMemo) return;

    const recipient =
      recipientType === "employee"
        ? `Employee ${employeeTarget.trim() || "(unknown)"}`
        : batchTarget === "all"
        ? "All employees"
        : batchTarget;

    setMemoMessage(`Memo "${memoName.trim()}" sent to ${recipient}.`);
    setMemoMode("view");
    resetMemoForm();
  };

  return (
    <div className="bg-image2 min-h-screen px-4 pb-8 pt-28 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section
          className={`overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-all duration-500 ${
            show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <div className="border-b border-slate-200 bg-slate-900 px-5 py-3 text-white sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-md bg-amber-300 px-2.5 py-1 font-bold text-slate-950">
                  Dashboard
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <FaCalendarAlt className="text-amber-300" />
                <span>{currentDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                Employee Self-Service
              </p>
              <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                {greeting}, {firstName}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Quickly check your profile details, leave balances, memos, and
                office orders from one simple dashboard.
              </p>
            </div>

            <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2 lg:min-w-[360px]">
              <SummaryItem
                icon={FaIdBadge}
                label="Employee No."
                value={employee?.empnumber || "N/A"}
              />
              <SummaryItem
                icon={FaBriefcase}
                label="Department"
                value={employee?.department || "N/A"}
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-2 border-b border-slate-200 bg-slate-50 p-2 md:grid-cols-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-[48px] items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <Icon className={isActive ? "text-amber-300" : "text-amber-600"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-6">
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
                isAdmin={
                  (employee?.role &&
                    (String(employee.role).toLowerCase() === "admin" ||
                      String(employee.role).toLowerCase() === "administrator" ||
                      String(employee.role).toLowerCase() === "admin_user")) ||
                  (employee?.position &&
                    String(employee.position).toLowerCase().includes("admin"))
                }
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
                onSendMemo={handleSendMemo}
                onCancelMemo={() => {
                  resetMemoForm();
                  setMemoMode("view");
                }}
                canSendMemo={canSendMemo}
              />
            )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Edit Profile</h3>
                <p className="text-sm text-slate-600">
                  Update your full name, address, and phone numbers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">First Name</label>
                  <input
                    name="firstname"
                    value={editData.firstname}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Middle Name</label>
                  <input
                    name="middlename"
                    value={editData.middlename}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                  <input
                    name="lastname"
                    value={editData.lastname}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Address</label>
                  <input
                    name="address"
                    value={editData.address}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Mobile Number</label>
                  <input
                    name="phone1"
                    value={editData.phone1}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Telephone Number</label>
                  <input
                    name="phone2"
                    value={editData.phone2}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              {editError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {editError}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {process.env.NODE_ENV === "development" && (
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
  );
}

function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-amber-100 text-amber-700">
        <Icon />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ProfileTab({ employee, fullName, onEditClick }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Full Name</p>
          <h2 className="text-xl font-bold text-slate-900">
            {fullName || "Employee"}
          </h2>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onEditClick}
            title="Edit profile"
            aria-label="Edit profile"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
          >
            <FaEdit className="h-4 w-4" />
          </button>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge icon={FaBriefcase} text={employee?.position || "Position N/A"} />
            <Badge icon={FaCalendarAlt} text={`Hired ${formatDate(employee?.datehired)}`} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      className={`rounded-lg border border-slate-200 bg-white p-4 ${
        wide ? "sm:col-span-2 lg:col-span-3" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            title={`Edit ${label}`}
            aria-label={`Edit ${label}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
          >
            <FaEdit className="h-4 w-4" />
          </button>
        )}
      </div>
      <p
        className={`mt-1 break-words text-base font-semibold ${
          highlight ? "text-emerald-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Badge({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700">
      <Icon className="text-amber-600" />
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
  onSendMemo,
  onCancelMemo,
  canSendMemo,
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Memos</p>
          <h2 className="text-xl font-bold text-slate-900">Employee Memo Management</h2>
          <p className="mt-1 text-sm text-slate-600">
            Paste a Google Drive memo image URL, then choose a specific employee or a batch to send.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setMemoMode("add")}
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Add Memo
          </button>
        )}
      </div>

      {memoMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
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
        <form onSubmit={onSendMemo} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Memo Name
              </label>
              <input
                type="text"
                value={memoName}
                onChange={(event) => setMemoName(event.target.value)}
                placeholder="Enter memo name"
                className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
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
                className="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Send memo to</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={recipientType === "employee"}
                    onChange={() => setRecipientType("employee")}
                    className="h-4 w-4"
                  />
                  Specific employee
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
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
                  <label className="block text-sm font-semibold text-slate-700">
                    Employee Number
                  </label>
                  <input
                    type="text"
                    value={employeeTarget}
                    onChange={(event) => setEmployeeTarget(event.target.value.replace(/\D/g, ""))}
                    placeholder="Enter employee number"
                    className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
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
                    className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
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

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancelMemo}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSendMemo}
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Send memo
            </button>
          </div>
        </form>
      ) : (
        <EmptyState
          icon={FaRegFileAlt}
          title="No memo posted"
          message="Add a memo link on the right and send it to a specific employee or by batch."
        />
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
