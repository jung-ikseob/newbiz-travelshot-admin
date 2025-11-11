import { useState, useMemo, useCallback, memo } from "react";
import { DEFAULT_MONTH } from "@/constants/shinhan-charts";
import { useOnlineOfflineData } from "@/hooks/shinhan/use-chart-data";
import { transformToChartData } from "@/utils/chart-helpers";
import ChartCard from "@/components/shared/charts/chart-card";
import DonutChart from "@/components/shared/charts/donut-chart";
import MonthSelector from "./month-selector";

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
  const { data: rawData, loading } = useOnlineOfflineData(selectedMonth);

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
