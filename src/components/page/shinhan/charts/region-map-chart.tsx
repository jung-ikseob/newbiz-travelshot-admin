import { Button, Card, Modal, Spin } from "antd";
import { Maximize2 } from "lucide-react";
import numeral from "numeral";
import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import MonthSelector from "./month-selector";
import { useRegionData } from "@/hooks/shinhan/use-chart-data";
import { DEFAULT_MONTH } from "@/constants/shinhan-charts";

interface MapContentProps {
  selectedMonth: string;
  isModal?: boolean;
  currentData: Record<string, number>;
  loading: boolean;
}

const MapContent = ({ selectedMonth, isModal = false, currentData, loading }: MapContentProps) => {
  const [tooltipContent, setTooltipContent] = useState("");

  const { topDistricts, districtRanks } = useMemo(() => {
    const sorted = Object.entries(currentData)
      .sort(([, a], [, b]) => b - a);

    const top6 = sorted.slice(0, 6);

    // 각 구의 순위를 매핑
    const ranks: Record<string, number> = {};
    sorted.forEach(([district], index) => {
      ranks[district] = index + 1;
    });

    return {
      topDistricts: top6,
      districtRanks: ranks,
    };
  }, [currentData]);

  const getColor = (districtName: string) => {
    const rank = districtRanks[districtName];
    if (!rank) return "#FEE2E2"; // 데이터 없음

    if (rank <= 7) return "#DC2626";      // 상위 1~7: 높음
    if (rank <= 16) return "#F87171";     // 상위 8~16: 중간
    return "#FEE2E2";                     // 상위 17~: 낮음
  };

  const width = isModal ? 800 : 320;
  const height = isModal ? 800 : 280;

  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex flex-1 gap-1">
        {/* 좌측: 지도 */}
        <div className="flex flex-col items-center justify-center flex-1">
          {/* 툴팁 */}
          {tooltipContent && (
            <div className={`absolute top-0 left-0 z-10 px-3 py-2 ${isModal ? "text-2xl" : "text-xs"} bg-white border rounded shadow-lg`}>
              {tooltipContent}
            </div>
          )}

          {/* 지도 */}
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: isModal ? 70000 : 38000,
              center: [126.98, 37.56],
            }}
            width={width}
            height={height}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography="/data/seoul-districts.json">
              {({ geographies }) =>
                geographies.map((geo: any) => {
                  const districtName = geo.properties.name || geo.properties.SIG_KOR_NM;
                  const value = currentData[districtName] || 0;
                  const color = getColor(districtName);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      onMouseEnter={() => {
                        setTooltipContent(
                          `${districtName}: ${numeral(value).format("0,0")}원`
                        );
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: "#7C3AED",
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* 우측: TOP 6 */}
        <div className={`${isModal ? "w-80" : "w-40"} flex flex-col justify-center`}>
          <div className={isModal ? "space-y-4" : "space-y-1"}>
            {topDistricts.map(([district, value], index) => (
              <div key={district} className={`text-gray-600 ${isModal ? "text-2xl" : "text-[10px]"}`}>
                {index + 1}. {district}: {numeral(value).format("0,0")}원
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 범례 - 하단 중앙 */}
      <div className={`flex justify-center items-center gap-6 ${isModal ? "mt-8" : "mt-2"}`}>
        <div className="flex items-center gap-3">
          <div className={`${isModal ? "w-8 h-8" : "w-3 h-3"} bg-[#DC2626]`} />
          <span className={isModal ? "text-xl" : "text-[10px]"}>높음</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`${isModal ? "w-8 h-8" : "w-3 h-3"} bg-[#F87171]`} />
          <span className={isModal ? "text-xl" : "text-[10px]"}>중간</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`${isModal ? "w-8 h-8" : "w-3 h-3"} bg-[#FEE2E2]`} />
          <span className={isModal ? "text-xl" : "text-[10px]"}>낮음</span>
        </div>
      </div>
    </div>
  );
};

const RegionMapChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom hook을 사용한 데이터 fetching
  const { data: currentData, loading } = useRegionData(selectedMonth);

  return (
    <>
      <Card className="flex flex-col h-full shadow-sm" styles={{ body: { padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' } }}>
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-800">
              지역 별 오프라인 판매 금액
            </h3>
            <div className="flex items-center gap-2">
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
              <Button
                type="text"
                size="small"
                icon={<Maximize2 size={16} />}
                onClick={() => setIsModalOpen(true)}
                title="크게 보기"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <MapContent
            selectedMonth={selectedMonth}
            isModal={false}
            currentData={currentData || {}}
            loading={loading}
          />
        </div>
      </Card>

      {/* 모달 팝업 */}
      <Modal
        title={<span className="text-lg font-semibold">지역 별 오프라인 판매 금액</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={1200}
        footer={null}
        centered
        bodyStyle={{ minHeight: "900px" }}
      >
        <div className="flex justify-end mb-3">
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
        <div className="py-4 h-full">
          <MapContent
            selectedMonth={selectedMonth}
            isModal={true}
            currentData={currentData || {}}
            loading={loading}
          />
        </div>
      </Modal>
    </>
  );
};

export default RegionMapChart;
