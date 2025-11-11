import { supabase } from "@/lib/supabase";
import { Card, Spin } from "antd";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import MonthSelector from "./month-selector";

// 임시 데이터 (API 실패 시 폴백용)
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
    { name: "오프라���", count: 6600, color: "#7C3AED" },
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
    { name: "오프라��", count: 5400, color: "#7C3AED" },
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

interface CardStatsResponse {
  card_use_ymd: string;
  stml_type_nm: string;
  card_use_sum_cnt: number;
}

const OnlineOfflineChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("2025-03");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<Array<{ name: string; count: number; color: string }> | null>(null);

  // API 호출
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthYm = selectedMonth.replace("-", "");
        const { data, error } = await supabase.rpc("get_card_stats_by_month", {
          month_ym: monthYm,
        });

        console.log("API Response:", { data, error, monthYm });

        if (error) throw error;

        if (data && data.length > 0) {
          console.log("Parsed result:", data);

          // API 데이터를 온라인/오프라인으로 구분
          const onlineData = data.find((item: CardStatsResponse) => item.stml_type_nm === "온라인");
          const offlineData = data.find((item: CardStatsResponse) => item.stml_type_nm === "오프라인");

          const chartData = [
            { name: "오프라인", count: offlineData?.card_use_sum_cnt || 0, color: "#7C3AED" },
            { name: "온라인", count: onlineData?.card_use_sum_cnt || 0, color: "#A78BFA" },
          ];

          console.log("Chart data:", chartData);
          setApiData(chartData);
        } else {
          console.log("No data returned, using mock data");
          setApiData(null);
        }
      } catch (error) {
        console.error("Failed to fetch card stats:", error);
        // API 실패 시 mock 데이터 사용
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  // API 데이터가 있으면 사용, 없으면 mock 데이터 사용
  const rawData = apiData || mockData[selectedMonth] || mockData["2025-03"];
  const total = rawData.reduce((sum, item) => sum + item.count, 0);

  console.log("Raw data:", rawData);
  console.log("Total:", total);

  // 비율 계산을 위한 데이터 변환
  const data = rawData.map(item => ({
    ...item,
    value: total > 0 ? (item.count / total) * 100 : 0, // 차트용 비율 (0으로 나누기 방지)
    count: item.count, // 범례용 건수
  }));

  console.log("Transformed data for chart:", data);

  // @ts-ignore - Recharts type compatibility issue with Next.js 16
  const ChartContainer: any = ResponsiveContainer;
  // @ts-ignore - Recharts type compatibility issue with Next.js 16
  const Chart: any = PieChart;
  // @ts-ignore - Recharts type compatibility issue with Next.js 16
  const PieComponent: any = Pie;
  // @ts-ignore - Recharts type compatibility issue with Next.js 16
  const LegendComponent: any = Legend;
  // @ts-ignore - Recharts type compatibility issue with Next.js 16
  const TooltipComponent: any = Tooltip;

  // 커스텀 Tooltip 컴포넌트
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-700">
            {numeral(data.count).format("0,0")}건 ({data.value.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col h-full shadow-sm" styles={{ body: { padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' } }}>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-800">월별 온오프라인 구매</h3>
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
        {/* <p className="text-sm text-gray-500">전체 {numeral(total).format("0,0")}건</p> */}
      </div>
      <div className="flex items-center justify-center flex-1 min-h-0">
        {loading ? (
          <Spin size="large" />
        ) : (
          <ChartContainer width="100%" height="100%">
            <Chart>
              <PieComponent
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="70%"
                innerRadius="45%"
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <TooltipComponent content={<CustomTooltip />} />
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                  />
                ))}
              </PieComponent>
              <LegendComponent
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value: any, entry: any) => (
                  <span className="text-sm text-gray-700">
                    {value} ({numeral(entry.payload.count).format("0,0")}건)
                  </span>
                )}
              />
            </Chart>
          </ChartContainer>
        )}
      </div>
    </Card>
  );
};

export default OnlineOfflineChart;
