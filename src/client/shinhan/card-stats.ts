import { ICardStatsParams, ICardStatsResponse } from "@/types/shinhan-card";
import qs from "qs";
import useSWR from "swr";

export const useCardStats = (params: ICardStatsParams = {}) => {
  return useSWR<ICardStatsResponse>(`api/shinhan/card-stats?${qs.stringify(params)}`);
};
