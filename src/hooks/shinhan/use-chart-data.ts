import { supabase } from "@/lib/supabase";
import { useEffect, useState, useCallback } from "react";

interface UseChartDataOptions<T> {
  fetchFn: (monthYm: string) => Promise<T>;
  selectedMonth: string;
}

interface UseChartDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 차트 데이터를 가져오는 공통 훅
 * API 호출을 담당
 */
export function useChartData<T>({
  fetchFn,
  selectedMonth,
}: UseChartDataOptions<T>): UseChartDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const monthYm = selectedMonth.replace("-", "");
      const result = await fetchFn(monthYm);
      setData(result);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
      setError(err as Error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
}

/**
 * 온오프라인 차트 데이터 타입
 */
export interface OnlineOfflineData {
  name: string;
  count: number;
  color: string;
}

/**
 * 온오프라인 차트 데이터를 가져오는 훅
 */
export function useOnlineOfflineData(selectedMonth: string) {
  const fetchFn = useCallback(async (monthYm: string): Promise<OnlineOfflineData[]> => {
    const { data, error } = await supabase.rpc("get_card_stats_by_month", {
      month_ym: monthYm,
    });

    if (error) {
      console.error("Online/Offline stats API error:", error);
      return [];
    }

    if (data && data.length > 0) {
      const onlineData = data.find((item: any) => item.stml_type_nm === "온라인");
      const offlineData = data.find((item: any) => item.stml_type_nm === "오프라인");

      return [
        { name: "오프라인", count: offlineData?.card_use_sum_cnt || 0, color: "#7C3AED" },
        { name: "온라인", count: onlineData?.card_use_sum_cnt || 0, color: "#A78BFA" },
      ];
    }

    return [];
  }, []);

  return useChartData<OnlineOfflineData[]>({
    fetchFn,
    selectedMonth,
  });
}

/**
 * 업종 차트 데이터 타입
 */
export interface IndustryData {
  name: string;
  count: number;
  color: string;
}

/**
 * 업종 차트 데이터를 가져오는 훅
 */
export function useIndustryData(
  selectedMonth: string,
  selectedType: "online" | "offline"
) {
  const fetchFn = useCallback(
    async (monthYm: string): Promise<IndustryData[]> => {
      const stmlType = selectedType === "online" ? 1 : 0;
      const { data, error } = await supabase.rpc("get_industry_stats_by_month", {
        p_month_ym: monthYm,
        p_stml_type: stmlType,
      });

      if (error) {
        console.error("Industry stats API error:", error);
        return [];
      }

      if (data && data.length > 0) {
        // 상위 5개만 선택
        const top5 = data.slice(0, 5);

        // 색상 배열
        const colors = ["#7C3AED", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"];

        return top5.map((item: any, index: number) => ({
          name: item.tpbiz_small_nm,
          count: item.card_use_sum_cnt,
          color: colors[index] || "#EDE9FE",
        }));
      }

      return [];
    },
    [selectedType]
  );

  return useChartData<IndustryData[]>({
    fetchFn,
    selectedMonth,
  });
}

/**
 * 지역 차트 데이터 타입
 */
export type RegionData = Record<string, number>;

/**
 * 지역 차트 데이터를 가져오는 훅
 */
export function useRegionData(selectedMonth: string) {
  const fetchFn = useCallback(async (monthYm: string): Promise<RegionData> => {
    const { data, error } = await supabase.rpc("get_region_stats_by_month", {
      p_month_ym: monthYm,
    });

    if (error) {
      console.error("Region stats API error:", error);
      return {};
    }

    if (data && data.length > 0) {
      const regionData: RegionData = {};
      data.forEach((item: any) => {
        regionData[item.sgg_nm] = item.card_use_sum_amt;
      });
      return regionData;
    }

    return {};
  }, []);

  return useChartData<RegionData>({
    fetchFn,
    selectedMonth,
  });
}
