import { Card, Spin } from "antd";
import { memo } from "react";
import { CHART_CONFIG } from "@/constants/shinhan-charts";

interface ChartCardProps {
  title: string;
  loading?: boolean;
  children: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
}

/**
 * 차트를 감싸는 공통 Card 컴포넌트
 * 일관된 스타일과 로딩 상태를 제공
 */
const ChartCard = memo<ChartCardProps>(({ title, loading = false, children, extra, className = "" }) => {
  return (
    <Card
      className={`flex flex-col h-full shadow-sm ${className}`}
      styles={{
        body: {
          padding: CHART_CONFIG.CARD.PADDING,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          {extra && <div className="flex items-center gap-2">{extra}</div>}
        </div>
      </div>
      <div className="flex items-center justify-center flex-1 min-h-0">
        {loading ? <Spin size="large" /> : children}
      </div>
    </Card>
  );
});

ChartCard.displayName = "ChartCard";

export default ChartCard;
