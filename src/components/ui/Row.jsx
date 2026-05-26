function Row({ label, value, highlight }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="p-3 font-medium text-gray-600 w-1/3">{label}</td>
      <td className={`p-3 ${highlight ? "text-green-600" : "text-gray-800"}`}>
        {value ?? <span className="text-gray-400">N/A</span>}
      </td>
    </tr>
  );
}

export default Row;
