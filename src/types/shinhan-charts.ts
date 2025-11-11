/**
 * 신한 차트 관련 타입 정의
 */

export interface ChartDataItem {
  name: string;
  count: number;
  color: string;
}

export interface ChartData extends ChartDataItem {
  value: number; // 비율 (퍼센트)
}

export interface ChartCardProps {
  title: string;
  loading?: boolean;
  children: React.ReactNode;
  extra?: React.ReactNode;
}

export interface DonutChartProps {
  data: ChartData[];
  activeIndex: number | null;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
  }>;
}
