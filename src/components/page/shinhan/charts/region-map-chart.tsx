import { Card, Modal, Button } from "antd";
import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import numeral from "numeral";
import MonthSelector from "./month-selector";
import { Maximize2 } from "lucide-react";

// 임시 데이터 - 실제 구 이름 매핑
const mockData: Record<string, Record<string, number>> = {
  "2025-03": {
    "강남구": 7500000,
    "서초구": 6800000,
    "종로구": 6570000,
    "송파구": 6200000,
    "마포구": 5800000,
    "중구": 5570000,
    "강동구": 4900000,
    "강서구": 4700000,
    "용산구": 4570000,
    "은평구": 4300000,
    "중랑구": 4200000,
    "양천구": 4100000,
    "동작구": 4000000,
    "서대문구": 3900000,
    "성북구": 3800000,
    "구로구": 3600000,
    "성동구": 3570000,
    "관악구": 3400000,
    "강북구": 3200000,
    "금천구": 3100000,
    "도봉구": 2900000,
    "광진구": 2570000,
    "노원구": 5100000,
    "동대문구": 1570000,
    "영등포구": 5500000,
  },
  "2025-02": {
    "강남구": 7300000,
    "서초구": 6600000,
    "종로구": 6200000,
    "송파구": 6000000,
    "마포구": 5600000,
    "중구": 5300000,
    "강동구": 4700000,
    "강서구": 4500000,
    "용산구": 4400000,
    "은평구": 4100000,
    "중랑구": 4000000,
    "양천구": 3900000,
    "동작구": 3800000,
    "서대문구": 3700000,
    "성북구": 3600000,
    "구로구": 3400000,
    "성동구": 3400000,
    "관악구": 3200000,
    "강북구": 3000000,
    "금천구": 2900000,
    "도봉구": 2700000,
    "광진구": 2400000,
    "노원구": 4900000,
    "동대문구": 1400000,
    "영등포구": 5300000,
  },
};

interface MapContentProps {
  selectedMonth: string;
  isModal?: boolean;
}

const MapContent = ({ selectedMonth, isModal = false }: MapContentProps) => {
  const currentData = mockData[selectedMonth] || mockData["2025-03"];
  const [tooltipContent, setTooltipContent] = useState("");

  const { minValue, maxValue, topDistricts } = useMemo(() => {
    const values = Object.values(currentData);
    const sorted = Object.entries(currentData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
      topDistricts: sorted,
    };
  }, [currentData]);

  const getColor = (value: number) => {
    if (!value) return "#FEE2E2";
    const ratio = (value - minValue) / (maxValue - minValue);

    if (ratio > 0.8) return "#DC2626";
    if (ratio > 0.6) return "#EF4444";
    if (ratio > 0.4) return "#F87171";
    if (ratio > 0.2) return "#FCA5A5";
    return "#FEE2E2";
  };

  const width = isModal ? 600 : 320;
  const height = isModal ? 600 : 280;

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex gap-1 flex-1">
        {/* 좌측: 지도 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* 툴팁 */}
          {tooltipContent && (
            <div className="absolute top-0 left-0 bg-white px-2 py-1 rounded shadow-lg border text-xs z-10">
              {tooltipContent}
            </div>
          )}

          {/* 지도 */}
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: isModal ? 55000 : 38000,
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
                  const color = getColor(value);

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
        <div className={`${isModal ? "w-36" : "w-32"} flex flex-col justify-center`}>
          <div className={isModal ? "space-y-2" : "space-y-1"}>
            {topDistricts.map(([district, value], index) => (
              <div key={district} className={isModal ? "text-xs" : "text-[10px]"}>
                <div className="text-gray-600 font-medium">
                  {index + 1}. {district}
                </div>
                <div className={`text-gray-500 ${isModal ? "text-[11px]" : "text-[9px]"}`}>
                  {numeral(value).format("0,0")}원
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 범례 - 하단 중앙 */}
      <div className={`flex justify-center items-center gap-3 ${isModal ? "mt-4" : "mt-2"}`}>
        <div className="flex items-center gap-1">
          <div className={`${isModal ? "w-4 h-4" : "w-3 h-3"} bg-[#DC2626]`} />
          <span className={isModal ? "text-xs" : "text-[10px]"}>높음</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`${isModal ? "w-4 h-4" : "w-3 h-3"} bg-[#F87171]`} />
          <span className={isModal ? "text-xs" : "text-[10px]"}>중간</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`${isModal ? "w-4 h-4" : "w-3 h-3"} bg-[#FEE2E2]`} />
          <span className={isModal ? "text-xs" : "text-[10px]"}>낮음</span>
        </div>
      </div>
    </div>
  );
};

const RegionMapChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("2025-03");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="shadow-sm h-full flex flex-col" styles={{ body: { padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' } }}>
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
          <MapContent selectedMonth={selectedMonth} isModal={false} />
        </div>
      </Card>

      {/* 모달 팝업 */}
      <Modal
        title={<span className="text-lg font-semibold">지역 별 오프라인 판매 금액</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={800}
        footer={null}
        centered
      >
        <div className="mb-3 flex justify-end">
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
        <div className="py-4">
          <MapContent selectedMonth={selectedMonth} isModal={true} />
        </div>
      </Modal>
    </>
  );
};

export default RegionMapChart;
