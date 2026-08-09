import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../../supabase";
import { useAuth } from "../../../context/AuthContext";

export default function ReviewApplication() {
  const [searchParams] = useSearchParams();
  const application_id = searchParams.get("id");
  const [loginData, setLoginData] = useState([]);
  const [application, setApplications] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
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
      // Supabase returned an error
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      // Successfully fetched user
      setLoginData(data);

    } catch (error) {
      // Unexpected error
      setLoginData([]);
      console.error("Unexpected error fetching user:", error);

    } finally {
      // Always stop loading
      setIsLoading(false);
    }
  };

  const fetchApplication = async () => {
    try {
      // Fetch leave applications
      const { data: applications } = await supabase
        .from("leave_applications")
        .select()
        .eq("status", "pending")
        .eq("status", "pending")
        .eq("approved_by", loginData.id)
        .order("created_at", { ascending: false })
        .throwOnError();

      if (!applications?.length) {
        setApplications([]);
        return;
      }

      // Get unique employee IDs
      const employeeIds = [
        ...new Set(applications.map((app) => app.employee_id)),
      ];

      // Fetch employees
      const { data: employees } = await supabase
        .from("employees")
        .select("id, firstname, middlename, lastname")
        .in("id", employeeIds)
        .throwOnError();

      // Create a lookup map
      const employeeMap = Object.fromEntries(
        employees.map((emp) => [emp.id, emp])
      );

      // Merge employee into each application
      const mergedData = applications.map((app) => ({
        ...app,
        employee: employeeMap[app.employee_id] || null,
      }));
      setApplications(mergedData);
    } catch (error) {
      console.error("Failed to fetch assigned leave applications:", error);
      setApplications([]);
    }
  };
  useEffect(() => {
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    fetchApplication();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  console.log(application, loginData);

  const ReviewApplicationSkeleton = () => {
    return (
      <div
        className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:px-10"
        style={{ background: "var(--section-bg)" }}
      >
        <div className="mx-auto max-w-5xl">

          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-72 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
          </div>

          {/* Card Skeleton */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* Application ID + Status */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />

                <div className="mt-2 h-5 w-20 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" />
            </div>

            {/* Details */}
            <div className="grid gap-6 md:grid-cols-2">

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item}>
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                  <div className="mt-2 h-5 w-40 animate-pulse rounded bg-slate-200" />
                </div>
              ))}

            </div>

            {/* Reason */}
            <div className="mt-8">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-24 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
              <div className="h-10 w-24 animate-pulse rounded-md bg-slate-200" />

              <div className="h-10 w-24 animate-pulse rounded-md bg-slate-200" />
            </div>

          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <ReviewApplicationSkeleton />;
  }

  return (
    <div
      className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:px-10"
      style={{ background: "var(--section-bg)" }}
    >
      <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-bold text-slate-900">
          Review Leave Application
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Please review the leave application below.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-slate-500">Employee</p>

            <p className="font-semibold text-slate-900">
              Testing.
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Leave Type</p>

            <p className="font-semibold">
              Testing.
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Start Date</p>

            <p className="font-semibold">
              Testing
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">End Date</p>

            <p className="font-semibold">
              Testing
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Days Requested
            </p>

            <p className="font-semibold">
              Testing
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Status
            </p>

            <span
              // className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              //   application.status === "Pending"
              //     ? "bg-yellow-100 text-yellow-700"
              //     : application.status === "Approved"
              //     ? "bg-emerald-100 text-emerald-700"
              //     : "bg-red-100 text-red-700"
              // }`}
            >
              {/* {application.status} */}
            </span>
          </div>

        </div>

        <div className="mt-8">

          <p className="text-sm text-slate-500">
            Leave Reason
          </p>

          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            Testing
          </div>

        </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              // onClick={handleReject}
              disabled
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {true ? "Processing..." : "Reject"}
            </button>

            <button
              // onClick={handleApprove}
              disabled
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {true ? "Processing..." : "Approve"}
            </button>

          </div>
      </div>
    </div>
  );
}