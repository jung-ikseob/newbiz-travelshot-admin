import { supabase } from "@/lib/supabase";
import { Button, Card, Modal, Spin } from "antd";
import { Maximize2 } from "lucide-react";
import numeral from "numeral";
import { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import MonthSelector from "./month-selector";

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
    "���서구": 4500000,
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

interface RegionStatsResponse {
  card_use_ymd: string;
  sgg_nm: string;
  card_use_sum_amt: number;
}

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
  const [selectedMonth, setSelectedMonth] = useState("2025-03");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<Record<string, number> | null>(null);

  // API 호출
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthYm = selectedMonth.replace("-", "");

        const { data, error } = await supabase.rpc("get_region_stats_by_month", {
          p_month_ym: monthYm,
        });

        console.log("Region API Response:", { data, error, monthYm });

        if (error) throw error;

        if (data && data.length > 0) {
          console.log("Region Parsed result:", data);

          // API 데이터를 구별로 매핑
          const regionData: Record<string, number> = {};
          data.forEach((item: RegionStatsResponse) => {
            regionData[item.sgg_nm] = item.card_use_sum_amt;
          });

          console.log("Region Chart data:", regionData);
          setApiData(regionData);
        } else {
          console.log("No data returned, using mock data");
          setApiData(null);
        }
      } catch (error) {
        console.error("Failed to fetch region stats:", error);
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  // API 데이터가 있으면 사용, 없으면 mock 데이터 사용
  const currentData = apiData || mockData[selectedMonth] || mockData["2025-03"];

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
                title="크��� 보기"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <MapContent
            selectedMonth={selectedMonth}
            isModal={false}
            currentData={currentData}
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
            currentData={currentData}
            loading={loading}
          />
        </div>
      </Modal>
    </>
  );
};

export default RegionMapChart;
