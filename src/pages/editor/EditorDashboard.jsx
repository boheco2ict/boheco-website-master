import { useState } from "react";
import PowerRateManagement from "./PowerRateManagement";
import PowerRateAdvisoryManagement from "./PowerRateAdvisoryManagement";
import {
  FaTachometerAlt,
  FaBolt,
  FaFileAlt,
} from "react-icons/fa";
import GenerationChargeManagement from "./GenerationChargeManagement";

function EditorDashboard() {
  const [activeTab, setActiveTab] = useState("power-rates");

  return (
    <div
      className="
        min-h-screen
        w-full
        px-4
        pb-8
        pt-20
        sm:px-6
        lg:px-8
        xl:pl-[calc(clamp(220px,14vw,240px)+24px)]
        xl:pr-6
        xl:pt-6
      "
      style={{ background: "var(--section-bg)" }}
    >
      <div className="w-full">

        {/* Navigation */}
        <nav className="mb-6 w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex min-w-max items-center px-2 sm:px-3">

            {/* Power Rates */}
            <button
              type="button"
              onClick={() => setActiveTab("power-rates")}
              className={`group relative flex items-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "power-rates"
                  ? "text-amber-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {/* Icon */}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  activeTab === "power-rates"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                }`}
              >
                <FaBolt size={14} />
              </span>

              <span>Power Rates</span>

              {/* Active Indicator */}
              {activeTab === "power-rates" && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Rate Advisory */}
            <button
              type="button"
              onClick={() => setActiveTab("rateadvisory")}
              className={`group relative flex items-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "rateadvisory"
                  ? "text-amber-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {/* Icon */}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  activeTab === "rateadvisory"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                }`}
              >
                <FaFileAlt size={14} />
              </span>

              <span>Rate Advisory</span>

              {/* Active Indicator */}
              {activeTab === "rateadvisory" && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-amber-500" />
              )}
            </button>

            {/* Generation Charge */}
            <button
              type="button"
              onClick={() => setActiveTab("generation-charge")}
              className={`group relative flex items-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === "generation-charge"
                  ? "text-amber-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {/* Icon */}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  activeTab === "generation-charge"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                }`}
              >
                <FaTachometerAlt size={14} />
              </span>

              <span>Generation Charge</span>

              {/* Active Indicator */}
              {activeTab === "generation-charge" && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-amber-500" />
              )}
            </button>

          </div>
        </nav>

        {/* Power Rates */}
        {activeTab === "power-rates" && (
          <PowerRateManagement />
        )}

        {/* Rate Advisory */}
        {activeTab === "rateadvisory" && (
          <PowerRateAdvisoryManagement />
        )}

        {/* Generation Charge */}
        {activeTab === "generation-charge" && (
          <GenerationChargeManagement />
        )}

      </div>
    </div>
  );
}

export default EditorDashboard;