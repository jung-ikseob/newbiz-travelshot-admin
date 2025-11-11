/**
 * 신한 차트 관련 상수
 */

// 차트 색상 팔레트
export const CHART_COLORS = {
  PRIMARY: "#7C3AED",
  SECONDARY: "#A78BFA",
  TERTIARY: "#C4B5FD",
  QUATERNARY: "#DDD6FE",
  QUINARY: "#EDE9FE",
} as const;

export const CHART_COLOR_ARRAY = [
  CHART_COLORS.PRIMARY,
  CHART_COLORS.SECONDARY,
  CHART_COLORS.TERTIARY,
  CHART_COLORS.QUATERNARY,
  CHART_COLORS.QUINARY,
] as const;

// 지역 차트 색상
export const REGION_COLORS = {
  HIGH: "#DC2626",
  MEDIUM: "#F87171",
  LOW: "#FEE2E2",
} as const;

// 차트 기본 설정
export const CHART_CONFIG = {
  DONUT: {
    OUTER_RADIUS: "70%",
    INNER_RADIUS: "45%",
  },
  LEGEND: {
    HEIGHT: 40,
    FONT_SIZE: "10px",
    PADDING_TOP: "2px",
    LINE_HEIGHT: "1.3",
  },
  CARD: {
    PADDING: "16px",
  },
} as const;

// 월 선택기 옵션
export const MONTH_OPTIONS = [
  { value: "2024-01", label: "2024년 1월" },
  { value: "2024-02", label: "2024년 2월" },
  { value: "2024-03", label: "2024년 3월" },
  { value: "2024-04", label: "2024년 4월" },
  { value: "2024-05", label: "2024년 5월" },
  { value: "2024-06", label: "2024년 6월" },
  { value: "2024-07", label: "2024년 7월" },
  { value: "2024-08", label: "2024년 8월" },
  { value: "2024-09", label: "2024년 9월" },
  { value: "2024-10", label: "2024년 10월" },
  { value: "2024-11", label: "2024년 11월" },
  { value: "2024-12", label: "2024년 12월" },
  { value: "2025-01", label: "2025년 1월" },
  { value: "2025-02", label: "2025년 2월" },
  { value: "2025-03", label: "2025년 3월" },
  { value: "2025-04", label: "2025년 4월" },
  { value: "2025-05", label: "2025년 5월" },
  { value: "2025-06", label: "2025년 6월" },
  { value: "2025-07", label: "2025년 7월" },
  { value: "2025-08", label: "2025년 8월" },
] as const;

export const DEFAULT_MONTH = "2025-03";
