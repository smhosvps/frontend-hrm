// components/SalesTable.tsx
import Loader from "@/components/loader/Loader";
import { useGetYearlySalesQuery } from "@/redux/features/storeOrder/storeOrderApi";
import { useState } from "react";

import { FaNairaSign, FaDollarSign } from "react-icons/fa6";

const currentYear = new Date().getFullYear();

const SalesTable = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const { data, isLoading, isError } = useGetYearlySalesQuery({ year: selectedYear });  

  console.log(data, "fff")

  // Generate year options from 2020 to current year
  const yearOptions = Array.from(
    { length: currentYear - 2019 },
    (_, i) => currentYear - i
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Yearly Sales Report ({selectedYear})
        </h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div className="text-red-500 p-4">Error loading sales data</div>
      ) : !data?.data ? (
        <div className="text-gray-500 p-4">No sales data available</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sales (NGN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sales (USD)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.data.map((monthData:any) => (
                <tr key={monthData.month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(2000, monthData.month - 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaNairaSign className="mr-1 text-gray-500" />
                      {monthData.totalNGN.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaDollarSign className="mr-1 text-gray-500" />
                      {monthData.totalUSD.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {monthData.count}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 font-semibold">Totals</td>
                <td className="px-6 py-4 font-semibold">
                  <FaNairaSign className="inline mr-1" />
                  {data.data
                    .reduce((sum:any, m:any) => sum + m.totalNGN, 0)
                    .toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </td>
                <td className="px-6 py-4 font-semibold">
                  <FaDollarSign className="inline mr-1" />
                  {data.data
                    .reduce((sum:any, m:any) => sum + m.totalUSD, 0)
                    .toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </td>
                <td className="px-6 py-4 font-semibold">
                  {data.data.reduce((sum:any, m:any) => sum + m.count, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesTable;