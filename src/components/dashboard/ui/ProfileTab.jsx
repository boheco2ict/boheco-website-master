import Badge from "./Badge";
import InfoCard from "./InfoCard";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaEdit,
  FaUser,
} from "react-icons/fa";
import FormatValue from "./FormatValue";
import FormatDate from "./FormatDate";

const profileFields = [
  { label: "Employee Number", key: "empnumber" },
  { label: "Department", key: "department" },
  { label: "Position", key: "position" },
  { label: "Status", key: "empstatus" },
  { label: "Address", key: "address", wide: true, editable: true },
  {
    label: "Mobile Number",
    key: "phone1",
    type: "mobile",
    editable: true,
  },
  {
    label: "Telephone Number",
    key: "phone2",
    editable: true,
  },
  { label: "Birthdate", key: "birthdate", type: "date" },
  { label: "TIN", key: "tin" },
  { label: "SSS", key: "sss" },
  { label: "Pag-IBIG", key: "pagibig" },
  { label: "PhilHealth", key: "philhealth" },
  { label: "Date Hired", key: "datehired", type: "date" },
  {
    label: "Basic Rate",
    key: "basicrate",
    type: "money",
    highlight: true,
  },
  {
    label: "Rice Allowance",
    key: "riceallowance",
    type: "money",
  },
];

function ProfileTab({ employee, fullName, onEditClick }) {
  return (
    <div className="space-y-6">

      {/* =========================================================
          PROFILE HERO
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">

        {/* Decorative background */}
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-slate-100/70 blur-3xl" />

        <div className="relative p-6 sm:p-7 lg:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Employee information */}
            <div className="flex min-w-0 items-start gap-4">

              {/* Avatar */}
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-200/50">
                <FaUser className="h-6 w-6" />
              </div>

              <div className="min-w-0">

                {/* Eyebrow */}
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Employee Profile
                  </p>
                </div>

                {/* Name */}
                <h2 className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {fullName || "Employee"}
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Review your profile information, verify your personal
                  details, and update your contact information when needed.
                </p>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    icon={FaBriefcase}
                    text={employee?.position || "Position N/A"}
                  />

                  <Badge
                    icon={FaCalendarAlt}
                    text={`Hired ${FormatDate(employee?.datehired)}`}
                  />

                  <Badge
                    icon={FaUser}
                    text={employee?.empstatus || "Status N/A"}
                  />
                </div>
              </div>
            </div>

            {/* Edit button */}
            <div className="flex flex-none">

              <button
                type="button"
                onClick={onEditClick}
                title="Edit profile"
                aria-label="Edit profile"
                className="
                  group
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-amber-200
                  bg-amber-50
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-amber-700
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-amber-300
                  hover:bg-amber-100
                  hover:shadow-md
                  focus:outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:ring-offset-2
                  sm:w-auto
                "
              >
                <FaEdit className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                Edit Profile
              </button>

            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

      </section>


      {/* =========================================================
          INFORMATION SECTION
      ========================================================= */}
      <section>

        {/* Section heading */}
        <div className="mb-4 flex items-end justify-between gap-4">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Personal Information
            </p>

            <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
              Employee Details
            </h3>
          </div>

          <div className="hidden h-px flex-1 bg-slate-200 sm:block" />

        </div>


        {/* Information cards */}
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

      </section>

    </div>
  );
}

export default ProfileTab;
