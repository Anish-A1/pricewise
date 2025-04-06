import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ProductType } from "@/types/types";
import { FaChevronLeft, FaChevronRight, FaSync } from "react-icons/fa";

interface ProdDChartProps {
  product: ProductType;
  chartWidth: string;
  chartHeight: string;
}

const ProdDChart = ({
  product,
  chartWidth = "90%",
  chartHeight = "200px",
}: ProdDChartProps) => {
  // Get the date of the last price variation
  const lastPriceDate = new Date(
    product.priceVariations[product.priceVariations.length - 1].date
  );
  const currentMonth = lastPriceDate.getMonth(); // 0-based index (0 = January, 11 = December)
  const currentYear = lastPriceDate.getFullYear();

  // Get the earliest price variation date
  const firstPriceDate = new Date(product.priceVariations[0].date);
  const firstMonth = firstPriceDate.getMonth();
  const firstYear = firstPriceDate.getFullYear();

  // State for the month offset
  const [monthOffset, setMonthOffset] = useState(0);

  // Helper function to calculate target month and year based on offset
  const calculateTargetDate = (offset: number) => {
    let targetYear = currentYear;
    let targetMonth = currentMonth - offset;

    while (targetMonth < 0) {
      targetMonth += 12;
      targetYear -= 1;
    }

    while (targetMonth > 11) {
      targetMonth -= 12;
      targetYear += 1;
    }

    return { targetYear, targetMonth };
  };

  // Format the range of months and year for display
  const formatMonthRange = (offset: number) => {
    const { targetYear, targetMonth } = calculateTargetDate(offset);

    const startOfRange = new Date(targetYear, targetMonth - 2, 1); // 3 months ago
    const endOfRange = new Date(targetYear, targetMonth, 1); // Current target month

    const options = { year: "numeric", month: "short" } as const;
    return `${startOfRange.toLocaleDateString("en-US", options)} - ${endOfRange.toLocaleDateString(
      "en-US",
      options
    )}`; // Example: "Sep 2024 - Nov 2024"
  };

  // Filter data for the 3-month range
  const filteredData = useMemo(() => {
    const { targetYear, targetMonth } = calculateTargetDate(monthOffset);

    // Calculate the start and end dates for the 3-month range
    const startOfRange = new Date(targetYear, targetMonth - 2, 1); // 3 months ago
    const endOfRange = new Date(targetYear, targetMonth + 1, 0); // End of target month

    return product.priceVariations.filter(({ date }) => {
      const priceDate = new Date(date);
      return priceDate >= startOfRange && priceDate <= endOfRange;
    });
  }, [monthOffset, product.priceVariations]);

  // Get min and max prices for Y-axis
  const minPrice = Math.min(...filteredData.map((p) => p.price));
  const maxPrice = Math.max(...filteredData.map((p) => p.price));

  // Chart data format
  const chartData = filteredData.map((priceData) => ({
    date: priceData.date,
    price: priceData.price,
  }));

  // Disable Back button if we're at the first available month range
  const isBackDisabled = useMemo(() => {
    const { targetYear, targetMonth } = calculateTargetDate(monthOffset + 3); // Moving 3 months back
    return targetYear < firstYear || (targetYear === firstYear && targetMonth < firstMonth);
  }, [monthOffset, firstYear, firstMonth]);

  // Disable Next button if we're at the latest available month range
  const isNextDisabled = useMemo(() => {
    const { targetYear, targetMonth } = calculateTargetDate(monthOffset - 3); // Moving 3 months forward
    return targetYear > currentYear || (targetYear === currentYear && targetMonth > currentMonth);
  }, [monthOffset, currentYear, currentMonth]);

  return (
    <div
      className="px-10 rounded-lg flex justify-center items-center w-full flex-col"
      style={{
        height: chartHeight,
        width: chartWidth,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "#333" }} />
          <YAxis
            tick={{ fill: "#333" }}
            domain={[minPrice - 3000, maxPrice + 3000]} // Adjust Y-axis
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#ff0000"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8 }}
            fillOpacity={1}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Container for Month and Year + Buttons */}
      <div className="flex justify-between items-center w-full -mt-11">
        {/* Month Range label */}
        <div className="text-basic font-semibold text-gray-800 tracking-wide ml-24">
          <span className="text-red-500">{formatMonthRange(monthOffset)}</span>
        </div>
        {/* Button Section */}
        <div
          className="flex justify-center items-center space-x-2"
          style={{ zIndex: 50 }}
        >
          {/* Back Button */}
          <button
            className={`px-3 py-1 text-red-500 rounded ${
              isBackDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={() => setMonthOffset((prev) => prev + 3)} // Move 3 months back
            disabled={isBackDisabled}
          >
            <FaChevronLeft size={18} />
          </button>

          {/* Current Month Button */}
          <button
            className="px-3 py-1 text-blue-500 rounded"
            onClick={() => setMonthOffset(0)} // Reset to current range
          >
            <FaSync size={18} />
          </button>

          {/* Next Button */}
          <button
            className={`px-3 py-1 text-red-500 rounded ${
              isNextDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={() => setMonthOffset((prev) => prev - 3)} // Move 3 months forward
            disabled={isNextDisabled}
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProdDChart;
