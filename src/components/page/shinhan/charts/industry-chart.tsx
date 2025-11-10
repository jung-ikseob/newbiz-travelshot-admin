import { supabase } from "@/lib/supabase";
import { Card, Select, Spin } from "antd";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import MonthSelector from "./month-selector";

// 임시 데이터 (2024-01 ~ 2025-08, 온/오프라인별) - 건수 기반
// 계절성 반영: 여름(6-8월)은 레저/여행 증가, 겨울(12-2월)은 의류/잡화 증가
const mockData: Record<string, Record<string, Array<{ name: string; count: number; color: string }>>> = {
  "2024-01": {
    online: [
      { name: "요식/유흥", count: 800, color: "#7C3AED" },
      { name: "의류/잡화", count: 850, color: "#A78BFA" },
      { name: "생활서비스", count: 600, color: "#C4B5FD" },
      { name: "레저/여행", count: 350, color: "#DDD6FE" },
      { name: "기타", count: 200, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2500, color: "#7C3AED" },
      { name: "의류/잡화", count: 2200, color: "#A78BFA" },
      { name: "생활서비스", count: 1500, color: "#C4B5FD" },
      { name: "레저/여행", count: 600, color: "#DDD6FE" },
      { name: "기타", count: 400, color: "#EDE9FE" },
    ],
  },
  "2024-02": {
    online: [
      { name: "요식/유흥", count: 820, color: "#7C3AED" },
      { name: "의류/잡화", count: 900, color: "#A78BFA" },
      { name: "생활서비스", count: 620, color: "#C4B5FD" },
      { name: "레저/여행", count: 380, color: "#DDD6FE" },
      { name: "기타", count: 210, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2450, color: "#7C3AED" },
      { name: "의류/잡화", count: 2300, color: "#A78BFA" },
      { name: "생활서비스", count: 1480, color: "#C4B5FD" },
      { name: "레저/여행", count: 650, color: "#DDD6FE" },
      { name: "기타", count: 420, color: "#EDE9FE" },
    ],
  },
  "2024-03": {
    online: [
      { name: "요식/유흥", count: 850, color: "#7C3AED" },
      { name: "의류/잡화", count: 880, color: "#A78BFA" },
      { name: "생활서비스", count: 650, color: "#C4B5FD" },
      { name: "레저/여행", count: 420, color: "#DDD6FE" },
      { name: "기타", count: 220, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2400, color: "#7C3AED" },
      { name: "의류/잡화", count: 2150, color: "#A78BFA" },
      { name: "생활서비스", count: 1520, color: "#C4B5FD" },
      { name: "레저/여행", count: 700, color: "#DDD6FE" },
      { name: "기타", count: 430, color: "#EDE9FE" },
    ],
  },
  "2024-04": {
    online: [
      { name: "요식/유흥", count: 880, color: "#7C3AED" },
      { name: "의류/잡화", count: 840, color: "#A78BFA" },
      { name: "생활서비스", count: 680, color: "#C4B5FD" },
      { name: "레저/여행", count: 480, color: "#DDD6FE" },
      { name: "기타", count: 230, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2350, color: "#7C3AED" },
      { name: "의류/잡화", count: 2050, color: "#A78BFA" },
      { name: "생활서비스", count: 1550, color: "#C4B5FD" },
      { name: "레저/여행", count: 800, color: "#DDD6FE" },
      { name: "기타", count: 450, color: "#EDE9FE" },
    ],
  },
  "2024-05": {
    online: [
      { name: "요식/유흥", count: 920, color: "#7C3AED" },
      { name: "의류/잡화", count: 800, color: "#A78BFA" },
      { name: "생활서비스", count: 700, color: "#C4B5FD" },
      { name: "레저/여행", count: 550, color: "#DDD6FE" },
      { name: "기타", count: 250, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2300, color: "#7C3AED" },
      { name: "의류/잡화", count: 1950, color: "#A78BFA" },
      { name: "생활서비스", count: 1580, color: "#C4B5FD" },
      { name: "레저/여행", count: 920, color: "#DDD6FE" },
      { name: "기타", count: 470, color: "#EDE9FE" },
    ],
  },
  "2024-06": {
    online: [
      { name: "요식/유흥", count: 950, color: "#7C3AED" },
      { name: "의류/잡화", count: 760, color: "#A78BFA" },
      { name: "생활서비스", count: 720, color: "#C4B5FD" },
      { name: "레저/여행", count: 650, color: "#DDD6FE" },
      { name: "기타", count: 260, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2250, color: "#7C3AED" },
      { name: "의류/잡화", count: 1850, color: "#A78BFA" },
      { name: "생활서비스", count: 1600, color: "#C4B5FD" },
      { name: "레저/여행", count: 1050, color: "#DDD6FE" },
      { name: "기타", count: 490, color: "#EDE9FE" },
    ],
  },
  "2024-07": {
    online: [
      { name: "요식/유흥", count: 980, color: "#7C3AED" },
      { name: "의류/잡화", count: 720, color: "#A78BFA" },
      { name: "생활서비스", count: 740, color: "#C4B5FD" },
      { name: "레저/여행", count: 750, color: "#DDD6FE" },
      { name: "기타", count: 270, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2200, color: "#7C3AED" },
      { name: "의류/잡화", count: 1780, color: "#A78BFA" },
      { name: "생활서비스", count: 1620, color: "#C4B5FD" },
      { name: "레저/여행", count: 1150, color: "#DDD6FE" },
      { name: "기타", count: 510, color: "#EDE9FE" },
    ],
  },
  "2024-08": {
    online: [
      { name: "요식/유흥", count: 1000, color: "#7C3AED" },
      { name: "의류/잡화", count: 700, color: "#A78BFA" },
      { name: "생활서비스", count: 750, color: "#C4B5FD" },
      { name: "레저/여행", count: 800, color: "#DDD6FE" },
      { name: "기타", count: 280, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2150, color: "#7C3AED" },
      { name: "의류/잡화", count: 1720, color: "#A78BFA" },
      { name: "생활서비스", count: 1640, color: "#C4B5FD" },
      { name: "레저/여행", count: 1200, color: "#DDD6FE" },
      { name: "기타", count: 520, color: "#EDE9FE" },
    ],
  },
  "2024-09": {
    online: [
      { name: "요식/유흥", count: 1020, color: "#7C3AED" },
      { name: "의류/잡화", count: 730, color: "#A78BFA" },
      { name: "생활서비스", count: 760, color: "#C4B5FD" },
      { name: "레저/여행", count: 720, color: "#DDD6FE" },
      { name: "기타", count: 290, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2100, color: "#7C3AED" },
      { name: "의류/잡화", count: 1750, color: "#A78BFA" },
      { name: "생활서비스", count: 1650, color: "#C4B5FD" },
      { name: "레저/여행", count: 1100, color: "#DDD6FE" },
      { name: "기타", count: 530, color: "#EDE9FE" },
    ],
  },
  "2024-10": {
    online: [
      { name: "요식/유흥", count: 1050, color: "#7C3AED" },
      { name: "의류/잡화", count: 760, color: "#A78BFA" },
      { name: "생활서비스", count: 780, color: "#C4B5FD" },
      { name: "레저/여행", count: 650, color: "#DDD6FE" },
      { name: "기타", count: 300, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2050, color: "#7C3AED" },
      { name: "의류/잡화", count: 1800, color: "#A78BFA" },
      { name: "생활서비스", count: 1670, color: "#C4B5FD" },
      { name: "레저/여행", count: 950, color: "#DDD6FE" },
      { name: "기타", count: 540, color: "#EDE9FE" },
    ],
  },
  "2024-11": {
    online: [
      { name: "요식/유흥", count: 1080, color: "#7C3AED" },
      { name: "의류/잡화", count: 800, color: "#A78BFA" },
      { name: "생활서비스", count: 800, color: "#C4B5FD" },
      { name: "레저/여행", count: 580, color: "#DDD6FE" },
      { name: "기타", count: 310, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 2000, color: "#7C3AED" },
      { name: "의류/잡화", count: 1900, color: "#A78BFA" },
      { name: "생활서비스", count: 1690, color: "#C4B5FD" },
      { name: "레저/여행", count: 820, color: "#DDD6FE" },
      { name: "기타", count: 550, color: "#EDE9FE" },
    ],
  },
  "2024-12": {
    online: [
      { name: "요식/유흥", count: 1100, color: "#7C3AED" },
      { name: "의류/잡화", count: 850, color: "#A78BFA" },
      { name: "생활서비스", count: 820, color: "#C4B5FD" },
      { name: "레저/여행", count: 520, color: "#DDD6FE" },
      { name: "기타", count: 320, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 1950, color: "#7C3AED" },
      { name: "의류/잡화", count: 2000, color: "#A78BFA" },
      { name: "생활서비스", count: 1700, color: "#C4B5FD" },
      { name: "레저/여행", count: 700, color: "#DDD6FE" },
      { name: "기타", count: 560, color: "#EDE9FE" },
    ],
  },
  "2025-01": {
    online: [
      { name: "요식/유흥", count: 1130, color: "#7C3AED" },
      { name: "의류/잡화", count: 900, color: "#A78BFA" },
      { name: "생활서비스", count: 840, color: "#C4B5FD" },
      { name: "레저/여행", count: 500, color: "#DDD6FE" },
      { name: "기타", count: 330, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 1900, color: "#7C3AED" },
      { name: "의류/잡화", count: 2050, color: "#A78BFA" },
      { name: "생활서비스", count: 1720, color: "#C4B5FD" },
      { name: "레저/여행", count: 650, color: "#DDD6FE" },
      { name: "기타", count: 570, color: "#EDE9FE" },
    ],
  },
  "2025-02": {
    online: [
      { name: "요식/유흥", count: 1150, color: "#7C3AED" },
      { name: "의류/잡화", count: 920, color: "#A78BFA" },
      { name: "생활서비스", count: 860, color: "#C4B5FD" },
      { name: "레저/여행", count: 530, color: "#DDD6FE" },
      { name: "기타", count: 340, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 1850, color: "#7C3AED" },
      { name: "의류/잡화", count: 2080, color: "#A78BFA" },
      { name: "생활서비스", count: 1740, color: "#C4B5FD" },
      { name: "레저/여행", count: 680, color: "#DDD6FE" },
      { name: "기타", count: 580, color: "#EDE9FE" },
    ],
  },
  "2025-03": {
    online: [
      { name: "요식/유흥", count: 1180, color: "#7C3AED" },
      { name: "의류/잡화", count: 950, color: "#A78BFA" },
      { name: "생활서비스", count: 880, color: "#C4B5FD" },
      { name: "레저/여행", count: 560, color: "#DDD6FE" },
      { name: "기타", count: 350, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 1800, color: "#7C3AED" },
      { name: "의류/잡화", count: 2000, color: "#A78BFA" },
      { name: "생활서비스", count: 1760, color: "#C4B5FD" },
      { name: "레저/여행", count: 720, color: "#DDD6FE" },
      { name: "기타", count: 590, color: "#EDE9FE" },
    ],
  },
  "2025-04": {
    online: [
      { name: "요식/유흥", count: 1200, color: "#7C3AED" },
      { name: "의류/잡화", count: 930, color: "#A78BFA" },
      { name: "생활서비스", count: 900, color: "#C4B5FD" },
      { name: "레저/여행", count: 600, color: "#DDD6FE" },
      { name: "기타", count: 360, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 1750, color: "#7C3AED" },
      { name: "의류/잡화", count: 1920, color: "#A78BFA" },
      { name: "생활서비스", count: 1780, color: "#C4B5FD" },
      { name: "레저/여행", count: 800, color: "#DDD6FE" },
      { name: "기타", count: 600, color: "#EDE9FE" },
    ],
  },
  "2025-05": {
    online: [
      { name: "요식/유흥", count: 1230, color: "#7C3AED" },
      { name: "의류/잡화", count: 900, color: "#A78BFA" },
      { name: "생활서비스", count: 920, color: "#C4B5FD" },
      { name: "레저/여행", count: 650, color: "#DDD6FE" },
      { name: "기타", count: 370, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 1700, color: "#7C3AED" },
      { name: "의류/잡화", count: 1850, color: "#A78BFA" },
      { name: "생활서비스", count: 1800, color: "#C4B5FD" },
      { name: "레저/여행", count: 900, color: "#DDD6FE" },
      { name: "기타", count: 610, color: "#EDE9FE" },
    ],
  },
  "2025-06": {
    online: [
      { name: "요식/유흥", count: 1260, color: "#7C3AED" },
      { name: "의류/잡화", count: 870, color: "#A78BFA" },
      { name: "생활서비스", count: 940, color: "#C4B5FD" },
      { name: "레저/여행", count: 720, color: "#DDD6FE" },
      { name: "기타", count: 380, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 1650, color: "#7C3AED" },
      { name: "의류/잡화", count: 1780, color: "#A78BFA" },
      { name: "생활서비스", count: 1820, color: "#C4B5FD" },
      { name: "레저/여행", count: 1020, color: "#DDD6FE" },
      { name: "기타", count: 620, color: "#EDE9FE" },
    ],
  },
  "2025-07": {
    online: [
      { name: "요식/유흥", count: 1290, color: "#7C3AED" },
      { name: "의류/잡화", count: 840, color: "#A78BFA" },
      { name: "생활서비스", count: 960, color: "#C4B5FD" },
      { name: "레저/여행", count: 800, color: "#DDD6FE" },
      { name: "기타", count: 390, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 1600, color: "#7C3AED" },
      { name: "의류/잡화", count: 1720, color: "#A78BFA" },
      { name: "생활서비스", count: 1840, color: "#C4B5FD" },
      { name: "레저/여행", count: 1120, color: "#DDD6FE" },
      { name: "기타", count: 630, color: "#EDE9FE" },
    ],
  },
  "2025-08": {
    online: [
      { name: "요식/유흥", count: 1320, color: "#7C3AED" },
      { name: "의류/잡화", count: 820, color: "#A78BFA" },
      { name: "생활서비스", count: 980, color: "#C4B5FD" },
      { name: "레저/여행", count: 850, color: "#DDD6FE" },
      { name: "기타", count: 400, color: "#EDE9FE" },
    ],
    offline: [
      { name: "요식/유흥", count: 1550, color: "#7C3AED" },
      { name: "의류/잡화", count: 1680, color: "#A78BFA" },
      { name: "생활서비스", count: 1860, color: "#C4B5FD" },
      { name: "레저/여행", count: 1180, color: "#DDD6FE" },
      { name: "기타", count: 640, color: "#EDE9FE" },
    ],
  },
};

// 업종별 색상 매핑
const INDUSTRY_COLORS: Record<string, string> = {
  "요식/유흥": "#7C3AED",
  "의류/잡화": "#A78BFA",
  "생활서비스": "#C4B5FD",
  "레저/여행": "#DDD6FE",
  "기타": "#EDE9FE",
};

interface IndustryStatsResponse {
  card_use_ymd: string;
  frcs_tpbiz_cd: string;
  card_use_sum_cnt: number;
  tpbiz_small_nm: string;
}

const IndustryChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("2025-03");
  const [selectedType, setSelectedType] = useState<"online" | "offline">("online");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<Array<{ name: string; count: number; color: string }> | null>(null);

  // API 호출
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthYm = selectedMonth.replace("-", "");
        const stlmType = selectedType === "online" ? "0" : "1";

        const { data, error } = await supabase.rpc("get_top5_stats_by_month", {
          p_stml_type: stlmType,
          p_month_ym: monthYm,
        });

        console.log("Industry API Response:", { data, error, monthYm, stlmType });

        if (error) throw error;

        if (data && data.length > 0) {
          console.log("Industry Parsed result:", data);

          const chartData = data.map((item: IndustryStatsResponse, index: number) => {
            const industryName = item.tpbiz_small_nm;
            const color = INDUSTRY_COLORS[industryName] || `hsl(${index * 60}, 70%, 70%)`;

            return {
              name: industryName,
              count: item.card_use_sum_cnt,
              color: color,
            };
          });

          console.log("Industry Chart data:", chartData);
          setApiData(chartData);
        } else {
          console.log("No data returned, using mock data");
          setApiData(null);
        }
      } catch (error) {
        console.error("Failed to fetch industry stats:", error);
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedType]);

  // API 데이터가 있으면 사용, 없으면 mock 데이터 사용
  const rawData = apiData || mockData[selectedMonth]?.[selectedType] || mockData["2025-03"].online;
  const total = rawData.reduce((sum, item) => sum + item.count, 0);

  // 비율 계산을 위한 데이터 변환
  const data = rawData.map(item => ({
    ...item,
    value: (item.count / total) * 100, // 차트용 비율
    count: item.count, // 범례용 건수
  }));


  return (
    <Card className="flex flex-col h-full shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-800">업종별 구매건</h3>
          <div className="flex items-center gap-2">
            <Select
              value={selectedType}
              onChange={setSelectedType}
              size="small"
              style={{ width: 90 }}
              options={[
                { value: "online", label: "온라인" },
                { value: "offline", label: "오프라인" },
              ]}
            />
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>
        </div>
        {/* <p className="text-sm text-gray-500">전체 {numeral(total).format("0,0")}건</p> */}
      </div>
      <div className="flex items-center justify-center flex-1">
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            {/* @ts-ignore - Recharts type compatibility issue with Next.js 16 */}
            <ResponsiveContainer width="100%" height={280}>
              {/* @ts-ignore - Recharts type compatibility issue with Next.js 16 */}
              <PieChart>
                {/* @ts-ignore - Recharts type compatibility issue with Next.js 16 */}
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                    />
                  ))}
                </Pie>
                {/* @ts-ignore - Recharts type compatibility issue with Next.js 16 */}
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
          </>
        )}
      </div>
    </Card>
  );
};

export default IndustryChart;
