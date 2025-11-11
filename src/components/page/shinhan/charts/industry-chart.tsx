import { Select } from "antd";
import { useCallback, useMemo, useState, memo } from "react";
import { transformToChartData } from "@/utils/chart-helpers";
import { DEFAULT_MONTH } from "@/constants/shinhan-charts";
import ChartCard from "@/components/shared/charts/chart-card";
import DonutChart from "@/components/shared/charts/donut-chart";
import MonthSelector from "./month-selector";
import { useIndustryData } from "@/hooks/shinhan/use-chart-data";

/**
 * 업종별 구매건 차트 컴포넌트 (리팩토링 버전)
 * - Custom hooks를 사용한 데이터 fetching
 * - 공통 컴포넌트(ChartCard, DonutChart) 활용
 * - React.memo를 사용한 최적화
 * - useMemo, useCallback을 사용한 불필요한 리렌더링 방지
 */
const IndustryChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);
  const [selectedType, setSelectedType] = useState<"online" | "offline">("online");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Custom hook을 사용한 데이터 fetching
  const { data: rawData, loading } = useIndustryData(selectedMonth, selectedType);

  // 차트 데이터 변환 (정렬 + 비율 계산) - useMemo로 최적화
  const chartData = useMemo(() => {
    if (!rawData) return [];
    return transformToChartData(rawData, true); // true = 정렬
  }, [rawData]);

  // 이벤트 핸들러 - useCallback으로 최적화
  const handleMouseEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleTypeChange = useCallback((value: "online" | "offline") => {
    setSelectedType(value);
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  return (
    <ChartCard
      title="업종별 구매건"
      loading={loading}
      extra={
        <>
          <Select
            value={selectedType}
            onChange={handleTypeChange}
            size="small"
            style={{ width: 90 }}
            options={[
              { value: "online", label: "온라인" },
              { value: "offline", label: "오프라인" },
            ]}
          />
          <MonthSelector selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
        </>
      }
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

export default memo(IndustryChart);
