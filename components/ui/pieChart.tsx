
"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

/* ✅ Real distribution */
const data = [
  { name: "Community Posts", value: 50, color: "#8A2BE2" },
  { name: "Direct Comments", value: 24, color: "#AF8AFE" },
  { name: "Profile Update", value: 10, color: "#F1F5F9" },
];

const TOTAL = data.reduce((acc, item) => acc + item.value, 0); 

export default function CommunityEngagementChart() {
  return (
    <div className="w-[30%] h-100 bg-white rounded-xl p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-inter text-[#272424] text-lg font-semibold">
          Community Engagement
        </h2>
        <p className="font-inter text-[#272424] text-xs font-normal">
          Activity distribution across platform
        </p>
      </div>

      {/* Chart */}
      <div className="relative w-full h-55">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              innerRadius={75}
              outerRadius={90}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-inter font-bold text-[#272424]">
            {TOTAL}%
          </span>
          <span className="font-inter text-[#272424] font-normal text-xs">
            ACTIVE
          </span> 
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2 text-xs">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-inter text-[#272424] font-normal text-xs">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}