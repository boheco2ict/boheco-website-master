import { FaExternalLinkAlt, FaBolt } from "react-icons/fa";

const RatesTable = ({ year, rateClass, thead, tbody, url }) => {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_14px_45px_rgba(15,23,42,0.09)]">

      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}

      <div className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-amber-50/40 px-5 py-5 sm:px-6">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Title */}
          <div>

            <div className="mb-2 flex items-center gap-2">

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <FaBolt size={14} />
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-600">
                Monthly Energy Rate
              </span>

            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {year} {rateClass.charAt(0).toUpperCase() + rateClass.slice(1)} Power Rates
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monthly rate summary in PHP per kWh.
            </p>

          </div>

          {/* View File */}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              <FaExternalLinkAlt size={12} />
              View File
            </a>
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* TABLE                                             */}
      {/* ================================================= */}

      <div className="relative overflow-x-auto">

        <table className="w-full min-w-[1050px] border-collapse text-sm">

          {/* ================================================= */}
          {/* TABLE HEADER                                      */}
          {/* ================================================= */}

          <thead>

            <tr className="bg-slate-950">

              {thead.map((item, index) => {

                const isAverage =
                  index === thead.length - 1;

                return (
                  <th
                    key={index}
                    className={`whitespace-nowrap px-4 py-3.5 text-center text-[10px] font-extrabold uppercase tracking-wider ${
                      isAverage
                        ? "bg-amber-500 text-white"
                        : "text-slate-300"
                    }`}
                  >
                    {item}
                  </th>
                );
              })}

            </tr>

          </thead>

          {/* ================================================= */}
          {/* TABLE BODY                                        */}
          {/* ================================================= */}

          <tbody>

            <tr className="border-b border-slate-100 bg-white transition-colors duration-200 hover:bg-amber-50/30">

              {tbody.map((item, index) => {

                const isAverage =
                  index === tbody.length - 1;

                const isEmpty =
                  item === null ||
                  item === undefined ||
                  item === "";

                return (
                  <td
                    key={index}
                    className={`whitespace-nowrap px-4 py-4 text-center ${
                      isAverage
                        ? "bg-amber-50/60 font-extrabold text-amber-700"
                        : "font-semibold text-slate-700"
                    }`}
                  >
                    {isEmpty ? (
                      <span className="text-xs font-medium text-slate-400">
                        N/A
                      </span>
                    ) : (
                      item
                    )}
                  </td>
                );
              })}

            </tr>

          </tbody>

        </table>

      </div>

      {/* ================================================= */}
      {/* FOOTER                                            */}
      {/* ================================================= */}

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">

        <p className="text-[11px] font-medium text-slate-400">
          All rates are expressed in PHP per kWh.
        </p>

        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:inline-flex">
          {year}
        </span>

      </div>

    </div>
  );
};

export default RatesTable;