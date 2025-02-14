import { fetchRevenue } from "@/actions/revenue";
import { generateRandomString } from "@/lib/util";

const Revenue = async ({ code, name }: { code: string; name: string }) => {
  const revenue = await fetchRevenue(code);
  const tbody = revenue.shimen_results.slice(1).filter((i) => !i.includes("ー"));
  return (
    <div className="rounded-lg p-1 border-gray-200 border overflow-x-auto">
      <h2 className="font-bold mb-1">
        {code} {name}
      </h2>

      <table>
        <thead>
          <tr className="bg-gray-100">
            {revenue.shimen_results[0].map((header) => (
              <th key={generateRandomString()} className="border p-1 text-xs">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tbody.map((row, rowIndex) => (
            <tr key={generateRandomString()} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, cellIndex) => (
                <td key={generateRandomString()} className="border p-1 text-xs">
                  {cell}{" "}
                  {rowIndex > 0 &&
                    tbody[rowIndex - 1][cellIndex] &&
                    Number(cell.replace(/,/g, "")) - Number(tbody[rowIndex - 1][cellIndex].replace(/,/g, "")) > 0 && (
                      <span className="text-red-500">↑</span>
                    )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Revenue;
