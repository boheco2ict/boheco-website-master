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
import DashboardLoading from "../../components/dashboard/ui/DashboardLoading";
import ProfileTab from "../../components/dashboard/ui/ProfileTab";
import LeaveCreditsTab from "../../components/dashboard/ui/LeaveCreditsTab";
import MemoTab from "../../components/dashboard/ui/MemoTab";
import OfficeOrderTab from "../../components/dashboard/ui/OfficeOrderTab";

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
  // Office order state (mirrors memo logic)
  const [orderMode, setOrderMode] = useState("view");
  const [orderTitle, setOrderTitle] = useState("");
  const [orderUrl, setOrderUrl] = useState("");
  const [orderRecipientType, setOrderRecipientType] = useState("employee");
  const [orderEmployeeTarget, setOrderEmployeeTarget] = useState("");
  const [orderBatchTarget, setOrderBatchTarget] = useState("all");
  const [orderMessage, setOrderMessage] = useState("");
  const [recipientOrders, setRecipientOrders] = useState([]);
  const [isOrderLoading, setIsOrderLoading] = useState(false);

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

  const isAdmin = useMemo(
    () =>
      (employee?.role &&
        ["admin", "administrator", "admin_user"].includes(
          String(employee.role).toLowerCase()
        )) ||
      (employee?.position &&
        String(employee.position).toLowerCase().includes("admin")),
    [employee?.role, employee?.position]
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
          employee_leave_balances (
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

  const fetchRecipientOrders = useCallback(async () => {
    if (!employee?.id) return;

    setIsOrderLoading(true);

    const { data, error } = await supabase
      .from("office_order_recipients")
      .select("id, is_read, office_order(id, title, url, created_at)")
      .eq("employee_id", employee.id);

    if (error) {
      console.error("Failed to fetch recipient orders:", error);
      setRecipientOrders([]);
    } else {
      setRecipientOrders(data || []);
    }

    setIsOrderLoading(false);
  }, [employee?.id]);

  useEffect(() => {
    if (activeTab !== "order" || !employee?.id) return;
    fetchRecipientOrders();
  }, [activeTab, employee?.id, fetchRecipientOrders]);

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

        if (
          recipientType === "employee" &&
          targetEmployee?.id === employee?.id
        ) {
          fetchRecipientMemos();
        }
      } catch (error) {
        console.error(error);
        setMemoMessage("An unexpected error occurred.");
      }
    },
    [
      canSendMemo,
      memoName,
      memoUrl,
      recipientType,
      employeeTarget,
      batchTarget,
      fetchRecipientMemos,
      employee,
      resetMemoForm,
    ]
  );

  const canSendOrder = useMemo(
    () =>
      orderTitle.trim().length > 0 &&
      orderUrl.trim().length > 0 &&
      (orderRecipientType !== "employee" ||
        orderEmployeeTarget.trim().length > 0),
    [orderTitle, orderUrl, orderRecipientType, orderEmployeeTarget]
  );

  const resetOrderForm = useCallback(() => {
    setOrderTitle("");
    setOrderUrl("");
    setOrderRecipientType("employee");
    setOrderEmployeeTarget("");
    setOrderBatchTarget("all");
    setOrderMessage("");
  }, []);

  const handleSendOrder = useCallback(
    async (event) => {
      event.preventDefault();

      if (!canSendOrder) return;

      try {
        let targetEmployee = null;

        if (orderRecipientType === "employee") {
          const { data: employeeData, error: employeeError } = await supabase
            .from("employees")
            .select("id, empnumber")
            .eq("empnumber", orderEmployeeTarget.trim())
            .maybeSingle();

          if (employeeError) {
            console.error("employee lookup failed:", employeeError);
            setOrderMessage("Unable to look up employee. Please try again.");
            return;
          }

          if (!employeeData) {
            setOrderMessage("Employee not found.");
            return;
          }

          targetEmployee = employeeData;

          if (!targetEmployee?.id) {
            setOrderMessage("Employee record has no valid ID.");
            return;
          }
        }

        const { data: orderData, error: orderError } = await supabase
          .from("office_order")
          .insert({
            title: orderTitle.trim(),
            url: orderUrl.trim(),
          })
          .select()
          .single();

        if (orderError || !orderData) {
          console.error(orderError);
          setOrderMessage("Failed to save office order.");
          return;
        }

        if (orderRecipientType === "employee") {
          const { error: recipientError } = await supabase
            .from("office_order_recipients")
            .insert({
              office_order_id: orderData.id,
              employee_id: targetEmployee.id,
              is_read: false,
            });

          if (recipientError) {
            console.error(recipientError);
            setOrderMessage(
              "Office order saved, but recipient assignment failed."
            );
            return;
          }
        }

        const recipient =
          orderRecipientType === "employee"
            ? `Employee ${orderEmployeeTarget.trim()}`
            : orderBatchTarget === "all"
            ? "All employees"
            : orderBatchTarget;

        setOrderMessage(
          `Office order "${orderTitle.trim()}" sent to ${recipient}.`
        );
        setOrderMode("view");
        resetOrderForm();

        if (
          orderRecipientType === "employee" &&
          targetEmployee?.id === employee?.id
        ) {
          fetchRecipientOrders();
        }
      } catch (error) {
        console.error(error);
        setOrderMessage("An unexpected error occurred.");
      }
    },
    [
      canSendOrder,
      orderTitle,
      orderUrl,
      orderRecipientType,
      orderEmployeeTarget,
      orderBatchTarget,
      fetchRecipientOrders,
      employee,
      resetOrderForm,
    ]
  );

  return (
    <>
      {/* top stripe removed to let navigation handle header background */}

      <div
        className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:px-10 xl:pl-[240px] xl:pt-20"
        style={{ background: "var(--section-bg)" }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          {/* Main Content */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            {/* Tab Navigation */}
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  Dashboard Sections
                </h2>
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
                        <span className="text-center leading-tight">
                          {tab.label}
                        </span>

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
                <LeaveCreditsTab
                  isAdmin={isAdmin}
                  leaveCredits={leaveCredits}
                  employee={employee}
                  setEmployee={setEmployee}
                />
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
                <OfficeOrderTab
                  isAdmin={isAdmin}
                  orderMode={orderMode}
                  setOrderMode={setOrderMode}
                  orderTitle={orderTitle}
                  setOrderTitle={setOrderTitle}
                  orderUrl={orderUrl}
                  setOrderUrl={setOrderUrl}
                  orderRecipientType={orderRecipientType}
                  setOrderRecipientType={setOrderRecipientType}
                  orderEmployeeTarget={orderEmployeeTarget}
                  setOrderEmployeeTarget={setOrderEmployeeTarget}
                  orderBatchTarget={orderBatchTarget}
                  setOrderBatchTarget={setOrderBatchTarget}
                  orderMessage={orderMessage}
                  recipientOrders={recipientOrders}
                  isOrderLoading={isOrderLoading}
                  onSendOrder={handleSendOrder}
                  onCancelOrder={() => {
                    resetOrderForm();
                    setOrderMode("view");
                  }}
                  canSendOrder={canSendOrder}
                />
              )}
            </div>
          </section>
        </div>

        {isEditOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(15,23,42,0.5)", padding: "1.5rem" }}
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl themed-bg-card"
              style={{ border: "1px solid var(--muted)" }}
            >
              <div className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between themed-bg-section themed-border">
                <div>
                  <h3 className="text-lg font-semibold themed-text">
                    Edit Profile
                  </h3>
                  <p className="text-sm themed-muted">
                    Update your full name, address, and phone numbers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-md border px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
                  style={{
                    borderColor: "var(--muted)",
                    background: "var(--card-bg)",
                    color: "var(--text-primary)",
                  }}
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={handleSaveEdit}
                className="space-y-4 p-6 themed-bg-card themed-text"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold themed-muted">
                      First Name
                    </label>
                    <input
                      name="firstname"
                      value={editData.firstname}
                      onChange={handleEditChange}
                      className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                      style={{ border: "1px solid var(--muted)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold themed-muted">
                      Middle Name
                    </label>
                    <input
                      name="middlename"
                      value={editData.middlename}
                      onChange={handleEditChange}
                      className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                      style={{ border: "1px solid var(--muted)" }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold themed-muted">
                      Last Name
                    </label>
                    <input
                      name="lastname"
                      value={editData.lastname}
                      onChange={handleEditChange}
                      className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                      style={{ border: "1px solid var(--muted)" }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      className="block text-sm font-semibold"
                      style={{ color: "var(--muted)" }}
                    >
                      Address
                    </label>
                    <input
                      name="address"
                      value={editData.address}
                      onChange={handleEditChange}
                      className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{
                        border: "1px solid var(--muted)",
                        background: "var(--card-bg)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold themed-muted">
                      Mobile Number
                    </label>
                    <input
                      name="phone1"
                      value={editData.phone1}
                      onChange={handleEditChange}
                      className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                      style={{ border: "1px solid var(--muted)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold themed-muted">
                      Telephone Number
                    </label>
                    <input
                      name="phone2"
                      value={editData.phone2}
                      onChange={handleEditChange}
                      className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                      style={{ border: "1px solid var(--muted)" }}
                    />
                  </div>
                </div>

                {editError && (
                  <div
                    className="rounded-md px-4 py-3 text-sm"
                    style={{
                      border: "1px solid var(--muted)",
                      background: "#fff6f6",
                      color: "#7f1d1d",
                    }}
                  >
                    {editError}
                  </div>
                )}

                <div
                  className="flex flex-col gap-3 themed-border pt-4 sm:flex-row sm:justify-end"
                  style={{ borderTopStyle: "solid" }}
                >
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition hover:bg-slate-100"
                    style={{
                      border: "1px solid var(--muted)",
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                    }}
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
    </>
  );
}

export default Dashboard;
