import { useState, useMemo, useCallback, memo } from "react";
import { DEFAULT_MONTH } from "@/constants/shinhan-charts";
import { useOnlineOfflineData, type OnlineOfflineData } from "@/hooks/shinhan/use-chart-data";
import { transformToChartData } from "@/utils/chart-helpers";
import ChartCard from "@/components/shared/charts/chart-card";
import DonutChart from "@/components/shared/charts/donut-chart";
import MonthSelector from "./month-selector";

// 임시 데이터 (API 실패 시 폴백용)
const mockData: Record<string, OnlineOfflineData[]> = {
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

/**
 * 온오프라인 구매 통계 차트 컴포넌트 (리팩토링 버전)
 * - Custom hooks를 사용한 데이터 fetching
 * - 공통 컴포넌트(ChartCard, DonutChart) 활용
 * - React.memo를 사용한 최적화
 * - useMemo, useCallback을 사용한 불필요한 리렌더링 방지
 */
const OnlineOfflineChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Custom hook을 사용한 데이터 fetching
  const { data: rawData, loading } = useOnlineOfflineData(selectedMonth, mockData);

  // 비율 계산 - useMemo로 최적화
  const chartData = useMemo(() => {
    if (!rawData) return [];
    return transformToChartData(rawData);
  }, [rawData]);

  // 이벤트 핸들러 - useCallback으로 최적화
  const handleMouseEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  return (
    <ChartCard
      title="월별 온오프라인 구매"
      loading={loading}
      extra={<MonthSelector selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />}
    >
      <DonutChart
        data={chartData}
        activeIndex={activeIndex}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </ChartCard>
  );
};

export default memo(OnlineOfflineChart);
