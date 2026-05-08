"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ================= TYPES ================= */
type DataPoint = {
  date: string; 
  value: number;
};

/* ================= HELPERS ================= */

// 🔢 Format numbers → 10000 → 10k
const formatNumber = (num: number): string => {
  if (num >= 1000) return `${Math.round(num / 1000)}k`;
  return num.toString();
};

// 📅 Generate last 30 days data
const generateDailyData = (): DataPoint[] => {
  const today = new Date();

  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (29 - i));

    return {
      date: d.toISOString(),
      value: Math.floor(5000 + Math.random() * 5000),
    };
  });
};

// 📅 Generate last 12 months data
const generateMonthlyData = (): DataPoint[] => {
  const today = new Date();

  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(today.getMonth() - (11 - i));

    return {
      date: d.toISOString(),
      value: Math.floor(5000 + Math.random() * 20000),
    };
  });
};

// 🎯 Filter logic (date-based)
const filterDataByRange = (
  data: DataPoint[],
  range: "30d" | "6m" | "12m"
): DataPoint[] => {
  const now = new Date();
  const pastDate = new Date();

  if (range === "30d") {
    pastDate.setDate(now.getDate() - 30);
  } else if (range === "6m") {
    pastDate.setMonth(now.getMonth() - 6);
  } else {
    pastDate.setFullYear(now.getFullYear() - 1);
  }

  return data.filter((item) => new Date(item.date) >= pastDate);
};

/* ================= COMPONENT ================= */

export default function UserGrowthChart() {
  const [range, setRange] = useState<"30d" | "6m" | "12m">("6m");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Generate data once (memoized)
  const dailyData = useMemo(() => generateDailyData(), []);
  const monthlyData = useMemo(() => generateMonthlyData(), []);

  // Select correct dataset
  const rawData = range === "30d" ? dailyData : monthlyData;

  // Apply filter
  const filtered = useMemo(
    () => filterDataByRange(rawData, range),
    [rawData, range]
  );

  // Format labels for chart
  const chartData = useMemo(() => {
    return filtered.map((item) => {
      const d = new Date(item.date);

      return {
        label:
          range === "30d"
            ? `${d.getDate()}`
            : d.toLocaleString("default", { month: "short" }),
        value: item.value,
      };
    });
  }, [filtered, range]);

  return (
    <div className="w-[70%] h-100 bg-white rounded-xl p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-inter text-[#272424] text-lg font-semibold">User Growth Trends</h2>
          <p className="font-inter text-[#272424] text-xs font-normal">
            Monthly breakdown of registered wellness numbers
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg font-inter font-medium text-xs">
          {[
            { label: "30D", value: "30d" },
            { label: "6M", value: "6m" },
            { label: "12M", value: "12m" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setRange(f.value as "30d" | "6m" | "12m")}
              className={`px-3 py-1 rounded-md text-sm transition-all duration-300  ${
                range === f.value
                  ? "bg-white  text-black scale-105"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
 
      {/* Chart */}
      <div className="w-full h-75 **:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <XAxis dataKey="label" tick={{ fill: "#272424", fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight:600}}/>
            <YAxis tickFormatter={formatNumber} tick={{ fill: "#272424", fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight:600}} />
            <Tooltip
  formatter={(value) => formatNumber(Number(value ?? 0))}
  cursor={{ fill: "none" }}
  contentStyle={{
    borderRadius: "10px",
    border: "none",
    
  }}
/>

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              animationDuration={500}
              animationEasing="ease-out"
            >
              {chartData.map((_, index) => {
                const isLast = index === chartData.length - 1;
                const isActive = index === activeIndex;

                return (
                  <Cell
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    fill={isLast ? "#8A2BE2" : "#F3E9FC"}
                    style={{
                      transition: "all 0.3s ease",
                      opacity: isActive ? 1 : 0.85,
                      transformOrigin: "bottom",
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

  );
}