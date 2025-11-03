import { ICardStatsParams, ICardStatsResponse } from "@/types/shinhan-card";
import qs from "qs";
import useSWR from "swr";

export const useCardStats = (params: ICardStatsParams = {}) => {
  const queryString = qs.stringify(params);
  const key = queryString ? `/api/shinhan/card-stats?${queryString}` : '/api/shinhan/card-stats';
  return useSWR<ICardStatsResponse>(key, {
    keepPreviousData: false,
    revalidateOnFocus: false,
  });
};
