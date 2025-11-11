import numeral from "numeral";
import { memo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_CONFIG } from "@/constants/shinhan-charts";
import type { ChartData } from "@/types/shinhan-charts";

interface DonutChartProps {
  data: ChartData[];
  activeIndex: number | null;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
  showLegend?: boolean;
  legendHeight?: number;
}

// 커스텀 Tooltip 컴포넌트
const CustomTooltip = memo<any>(({ active, payload }: any) => {
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
});

CustomTooltip.displayName = "CustomTooltip";

/**
 * 공통 도넛 차트 컴포넌트
 * 재사용 가능한 도넛 차트 UI를 제공
 */
const DonutChart = memo<DonutChartProps>(
  ({
    data,
    activeIndex,
    onMouseEnter,
    onMouseLeave,
    showLegend = true,
    legendHeight = CHART_CONFIG.LEGEND.HEIGHT,
  }) => {
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

    return (
      <ChartContainer width="100%" height="100%">
        <Chart>
          <PieComponent
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={CHART_CONFIG.DONUT.OUTER_RADIUS}
            innerRadius={CHART_CONFIG.DONUT.INNER_RADIUS}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={(_: any, index: number) => onMouseEnter(index)}
            onMouseLeave={onMouseLeave}
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
          {showLegend && (
            <LegendComponent
              verticalAlign="bottom"
              height={legendHeight}
              iconType="circle"
              wrapperStyle={{
                fontSize: CHART_CONFIG.LEGEND.FONT_SIZE,
                paddingTop: CHART_CONFIG.LEGEND.PADDING_TOP,
                lineHeight: CHART_CONFIG.LEGEND.LINE_HEIGHT,
                marginBottom: "0",
              }}
              formatter={(value: any, entry: any) => (
                <span
                  style={{
                    fontSize: CHART_CONFIG.LEGEND.FONT_SIZE,
                    whiteSpace: "nowrap",
                  }}
                >
                  {value} ({numeral(entry.payload.count).format("0,0")}건)
                </span>
              )}
            />
          )}
        </Chart>
      </ChartContainer>
    );
  }
);

DonutChart.displayName = "DonutChart";

export default DonutChart;
