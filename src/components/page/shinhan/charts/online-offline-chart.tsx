import { Card } from "antd";
import numeral from "numeral";
import { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import MonthSelector from "./month-selector";

// 임시 데이터 (2024-01 ~ 2025-08) - 건수 기반
// 온라인이 점진적으로 증가하는 추세
const mockData: Record<string, Array<{ name: string; count: number; color: string }>> = {
  "2024-01": [
    { name: "오프라인", count: 7200, color: "#7C3AED" },
    { name: "온라인", count: 2800, color: "#A78BFA" },
  ],
  "2024-02": [
    { name: "오프라인", count: 6900, color: "#7C3AED" },
    { name: "온라인", count: 3100, color: "#A78BFA" },
  ],
  "2024-03": [
    { name: "오프라인", count: 6800, color: "#7C3AED" },
    { name: "온라인", count: 3200, color: "#A78BFA" },
  ],
  "2024-04": [
    { name: "오프라인", count: 6600, color: "#7C3AED" },
    { name: "온라인", count: 3400, color: "#A78BFA" },
  ],
  "2024-05": [
    { name: "오프라인", count: 6400, color: "#7C3AED" },
    { name: "온라인", count: 3600, color: "#A78BFA" },
  ],
  "2024-06": [
    { name: "오프라인", count: 6200, color: "#7C3AED" },
    { name: "온라인", count: 3800, color: "#A78BFA" },
  ],
  "2024-07": [
    { name: "오프라인", count: 6100, color: "#7C3AED" },
    { name: "온라인", count: 3900, color: "#A78BFA" },
  ],
  "2024-08": [
    { name: "오프라인", count: 6000, color: "#7C3AED" },
    { name: "온라인", count: 4000, color: "#A78BFA" },
  ],
  "2024-09": [
    { name: "오프라인", count: 5900, color: "#7C3AED" },
    { name: "온라인", count: 4100, color: "#A78BFA" },
  ],
  "2024-10": [
    { name: "오프라인", count: 5700, color: "#7C3AED" },
    { name: "온라인", count: 4300, color: "#A78BFA" },
  ],
  "2024-11": [
    { name: "오프라인", count: 5600, color: "#7C3AED" },
    { name: "온라인", count: 4400, color: "#A78BFA" },
  ],
  "2024-12": [
    { name: "오프라인", count: 5500, color: "#7C3AED" },
    { name: "온라인", count: 4500, color: "#A78BFA" },
  ],
  "2025-01": [
    { name: "오프라인", count: 5400, color: "#7C3AED" },
    { name: "온라인", count: 4600, color: "#A78BFA" },
  ],
  "2025-02": [
    { name: "오프라인", count: 5300, color: "#7C3AED" },
    { name: "온라인", count: 4700, color: "#A78BFA" },
  ],
  "2025-03": [
    { name: "오프라인", count: 5200, color: "#7C3AED" },
    { name: "온라인", count: 4800, color: "#A78BFA" },
  ],
  "2025-04": [
    { name: "오프라인", count: 5100, color: "#7C3AED" },
    { name: "온라인", count: 4900, color: "#A78BFA" },
  ],
  "2025-05": [
    { name: "오프라인", count: 5000, color: "#7C3AED" },
    { name: "온라인", count: 5000, color: "#A78BFA" },
  ],
  "2025-06": [
    { name: "오프라인", count: 4900, color: "#7C3AED" },
    { name: "온라인", count: 5100, color: "#A78BFA" },
  ],
  "2025-07": [
    { name: "오프라인", count: 4800, color: "#7C3AED" },
    { name: "온라인", count: 5200, color: "#A78BFA" },
  ],
  "2025-08": [
    { name: "오프라인", count: 4700, color: "#7C3AED" },
    { name: "온라인", count: 5300, color: "#A78BFA" },
  ],
};

const OnlineOfflineChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("2025-03");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const rawData = mockData[selectedMonth] || mockData["2025-03"];
  const total = rawData.reduce((sum, item) => sum + item.count, 0);

  // 비율 계산을 위한 데이터 변환
  const data = rawData.map(item => ({
    ...item,
    value: (item.count / total) * 100, // 차트용 비율
    count: item.count, // 범례용 건수
  }));

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    // hover 상태일 때만 표시
    if (activeIndex !== index) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="flex flex-col h-full shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-800">월별 온오프라인 구매</h3>
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
        {/* <p className="text-sm text-gray-500">전체 {numeral(total).format("0,0")}건</p> */}
      </div>
      <div className="flex items-center justify-center flex-1">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-sm text-gray-700">
                  {value} ({numeral(entry.payload.count).format("0,0")}건)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default OnlineOfflineChart;
