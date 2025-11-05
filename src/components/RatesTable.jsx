import { useState } from "react";
import { FaChevronUp } from "react-icons/fa";
// import ListComponent from "./ListComponent";
const RatesTable = ({ year, thead, tbody, url }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="flex items-center justify-center pb-2"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 text-sm py-2">
          <FaChevronUp
            className={`w-4 h-4 transition-transform duration-300 ${
              open && "rotate-180"
            }`}
          />
          <span>{year} Summary of Power Rates</span>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="table-auto text-sm bg-white shadow-md min-w-max">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                {thead.map((item, index) => (
                  <th className="px-4 py-2 border border-gray-300" key={index}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="hover:bg-gray-100 transition">
                {tbody.map((item, index) => (
                  <td className="px-4 py-2 border border-gray-300" key={index}>
                    {item}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="py-4">
          {/* <ListComponent
            title={`Rate Components for Residential ${year}`}
            url={url}
          /> */}
        </div>
      </div>
    </>
  );
};

export default RatesTable;
