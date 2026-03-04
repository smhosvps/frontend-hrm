import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaDollarSign, FaDownload } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetAllOfflineTitheQuery } from "@/redux/features/give/titheApi";
import { useGetAllOfferingQuery } from "@/redux/features/give/offeringApi";
import { FaMonero } from "react-icons/fa6";
import { Link } from "react-router-dom";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinanceDashboard() {
  const { data: tithesData, isLoading: tithesLoading } =
    useGetAllOfflineTitheQuery({});
  const { data: offeringsData, isLoading: offeringsLoading } =
    useGetAllOfferingQuery({});

  const { chartData, totals } = useMemo(() => {
    const chart: any[] = [];
    console.log(chart);
    const totals = { usd: 0, ngn: 0, totalTransactions: 0 };
    const monthlyData: { [key: string]: any } = {};

    const processTransaction = (
      transaction: any,
      type: "tithe" | "offering"
    ) => {
      const date = new Date(transaction.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthYear = `${year}-${month}`;
      const currency = transaction.currency;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: MONTHS[month],
          year,
          ngnTithes: 0,
          usdTithes: 0,
          ngnOfferings: 0,
          usdOfferings: 0,
        };
      }

      const amountField =
        currency === "NGN"
          ? `${currency.toLowerCase()}${
              type === "tithe" ? "Tithes" : "Offerings"
            }`
          : `${currency.toLowerCase()}${
              type === "tithe" ? "Tithes" : "Offerings"
            }`;

      monthlyData[monthYear][amountField] += transaction.amount;
      totals[currency === "NGN" ? "ngn" : "usd"] += transaction.amount;
      totals.totalTransactions++;
    };

    tithesData?.offerings?.forEach((t: any) => processTransaction(t, "tithe"));
    offeringsData?.offerings?.forEach((o: any) =>
      processTransaction(o, "offering")
    );

    // Convert to array and sort chronologically
    const chartData = Object.values(monthlyData).sort((a, b) =>
      a.year === b.year ? a.month - b.month : a.year - b.year
    );

    return { chartData, totals };
  }, [tithesData, offeringsData]);

  const handleCSVExport = () => {
    const headers =
      "Month,Year,NGN Tithes,USD Tithes,NGN Offerings,USD Offerings\n";
    const csvContent = chartData
      .map(
        (entry) =>
          `${entry.month},${entry.year},${entry.ngnTithes},${entry.usdTithes},${entry.ngnOfferings},${entry.usdOfferings}`
      )
      .join("\n");

    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (tithesLoading || offeringsLoading) {
    return (
      <div className="p-6">
        <Skeleton height={40} className="mb-4" />
        <Skeleton height={300} className="mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton height={100} />
          <Skeleton height={100} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Link to="/finance-dashboard/monthly-transactions">
          <div className="bg-yellow-500 text-gray-800 rounded-lg p-1.5 font-medium">Monthly Transaction</div>
        </Link>

        <button
          onClick={handleCSVExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaDownload className="text-lg" />
          <span>Download Report</span>
        </button>
      </div>

      {/* Currency Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-3">
            <FaMonero className="text-green-600 text-xl" />
            <h3 className="text-lg font-semibold text-green-800">
              Naira Transactions
            </h3>
          </div>
          <p className="text-2xl font-bold text-green-700">
            ₦{(totals.ngn || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <FaDollarSign className="text-blue-600 text-xl" />
            <h3 className="text-lg font-semibold text-blue-800">
              Dollar Transactions
            </h3>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            ${(totals.usd || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[500px] mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Monthly Transaction Overview
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280" }}
              tickFormatter={(value, index) =>
                `${value} ${chartData[index]?.year}`
              }
            />
            <YAxis
              tick={{ fill: "#6b7280" }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => (
                <span className="text-gray-600 text-sm">{value}</span>
              )}
            />

            {/* NGN Bars */}
            <Bar
              dataKey="ngnTithes"
              name="Tithes (NGN)"
              fill="#059669"
              stackId="ngn"
            />
            <Bar
              dataKey="ngnOfferings"
              name="Offerings (NGN)"
              fill="#34d399"
              stackId="ngn"
            />

            {/* USD Bars */}
            <Bar
              dataKey="usdTithes"
              name="Tithes (USD)"
              fill="#2563eb"
              stackId="usd"
            />
            <Bar
              dataKey="usdOfferings"
              name="Offerings (USD)"
              fill="#60a5fa"
              stackId="usd"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
