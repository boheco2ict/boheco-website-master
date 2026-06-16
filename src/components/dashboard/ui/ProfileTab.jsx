import Badge from "./Badge";
import InfoCard from "./InfoCard";
import { FaBriefcase, FaCalendarAlt, FaEdit, FaUser } from "react-icons/fa";
import FormatValue from "./FormatValue";
import FormatDate from "./FormatDate";

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

function ProfileTab({ employee, fullName, onEditClick }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.6fr_auto]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Employee profile
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              {fullName || "Employee"}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Review your profile information, verify personal details, and
              update contact fields when needed.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              icon={FaBriefcase}
              text={employee?.position || "Position N/A"}
            />
            <Badge
              icon={FaCalendarAlt}
              text={`Hired ${FormatDate(employee?.datehired)}`}
            />
            <Badge icon={FaUser} text={employee?.empstatus || "Status N/A"} />
          </div>
        </div>

        <div className="flex flex-col gap-3 items-start justify-start lg:flex-row lg:items-center lg:justify-between">
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
            value={FormatValue(employee, field)}
            wide={field.wide}
            highlight={field.highlight}
          />
        ))}
      </div>
    </div>
  );
}

export default ProfileTab;
