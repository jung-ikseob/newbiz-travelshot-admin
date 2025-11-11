import type { ChartData, ChartDataItem } from "@/types/shinhan-charts";

/**
 * 차트 데이터를 비율이 포함된 형태로 변환
 * @param rawData 원본 데이터 (count만 있는 형태)
 * @param sorted 정렬 여부 (count 기준 내림차순)
 * @returns 비율(value)이 추가된 차트 데이터
 */
export function transformToChartData(rawData: ChartDataItem[], sorted: boolean = false): ChartData[] {
  // 정렬이 필요한 경우 count 기준 내림차순
  const dataToProcess = sorted ? [...rawData].sort((a, b) => b.count - a.count) : rawData;

  const total = dataToProcess.reduce((sum, item) => sum + item.count, 0);

  return dataToProcess.map((item) => ({
    ...item,
    value: total > 0 ? (item.count / total) * 100 : 0,
  }));
}

/**
 * YYYYMMDD 형식의 날짜를 YYYY-MM-DD 형식으로 변환
 * @param dateString YYYYMMDD 형식의 문자열
 * @returns YYYY-MM-DD 형식의 문자열
 */
export function formatCardUseDate(dateString: string): string {
  if (dateString && dateString.length === 8) {
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
  }
  return dateString;
}

/**
 * 온오프라인 타입을 한글로 변환
 * @param stmlType 0 또는 1
 * @returns "온라인" 또는 "오프라인"
 */
export function formatStmlType(stmlType: number): string {
  return stmlType === 1 ? "온라인" : "오프라인";
}
