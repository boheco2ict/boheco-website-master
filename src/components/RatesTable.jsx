import { FaExternalLinkAlt } from "react-icons/fa";

const RatesTable = ({ year, thead, tbody, url }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {year} Residential Power Rates
          </h2>
          <p className="text-sm text-slate-500">
            Monthly rate summary in PHP per kWh.
          </p>
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <FaExternalLinkAlt size={13} />
            View file
          </a>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] table-auto text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase text-white">
            <tr>
              {thead.map((item, index) => (
                <th className="whitespace-nowrap px-4 py-3 font-bold" key={index}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="border-t border-slate-200">
              <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">
                Residential
              </td>
              {tbody.map((item, index) => (
                <td className="whitespace-nowrap px-4 py-3" key={index}>
                  {item ?? "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatesTable;
