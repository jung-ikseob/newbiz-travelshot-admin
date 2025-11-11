export interface ICardStats {
  card_use_ymd: string;        // 카드사용시점
  gsd_nm: string;               // 소재지(시도)
  sgg_nm: string;               // 소재지(시군구)
  tpbiz_large_nm: string;       // 업종(대)
  tpbiz_mediaum_nm: string;     // 업종(중) - 실제 컬럼명은 mediaum (오타)
  tpbiz_small_nm: string;       // 업종(소)
  stml_type: number;            // 온오프라인 (0: 오프라인, 1: 온라인)
  card_use_sum_amt: number;     // 카드이용금액계
  card_use_sum_cnt: number;     // 카드이용건수계
}

export interface ICardStatsParams {
  page?: number;
  limit?: number;
}

export interface ICardStatsResponse {
  code: number;
  message: string;
  data: {
    items: ICardStats[];
    page: {
      currentPage: number;
      pageSize: number;
      totalPage: number;
      totalCount: number;
    };
    cursor?: {
      lastCardUseYmd: string;
      lastId: number;
    } | null;
  };
}
