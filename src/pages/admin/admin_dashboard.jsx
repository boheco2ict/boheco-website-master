import { useState } from "react";
import LeaveApprover from "./leave_approver";
import Employee from "./employee_management";

import {
  FaUserShield,
} from "react-icons/fa";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("leave-approver");

  return (
    <div
      className="w-full pl-5 pr-5 pt-[21px] pb-5 min-h-screen"
      style={{ background: "var(--section-bg)" }}
    >
      <div className="w-full">
        {/* Navigation */}
        <nav className="mb-6 w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          
          <div className="flex min-w-max items-center px-2 sm:px-3">

            {/* Leave Approver */}
            <button
              type="button"
              onClick={() => setActiveTab("leave-approver")}
              className={`group relative flex items-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "leave-approver"
                  ? "text-blue-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >

              {/* Icon */}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  activeTab === "leave-approver"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                }`}
              >
                <FaUserShield size={14} />
              </span>

              <span>
                Leave Approver
              </span>

              {/* Active Indicator */}
              {activeTab === "leave-approver" && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Employee */}
            <button
              type="button"
              onClick={() => setActiveTab("employee")}
              className={`group relative flex items-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "employee"
                  ? "text-blue-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >

              {/* Icon */}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  activeTab === "employee"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                }`}
              >
                <FaUserShield size={14} />
              </span>

              <span>
                Employee
              </span>

              {/* Active Indicator */}
              {activeTab === "employee" && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-blue-600" />
              )}

            </button>

          </div>

        </nav>


        {/* Leave Approver Content */}
        {activeTab === "leave-approver" && (
          <LeaveApprover />
        )}
        {/* Employee Content */}
        {activeTab === "employee" && (
          <Employee />
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;