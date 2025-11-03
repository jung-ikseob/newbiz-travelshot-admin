import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    // SHCARD_STATS 테이블에서 데이터 조회
    const { data: statsData, error: statsError } = await supabase
      .from('SHCARD_STATS')
      .select('card_use_ymd, card_use_sum_amt, card_use_sum_cnt, stml_type, id')
      .range(offset, offset + limit - 1)
      .order('card_use_ymd', { ascending: false });

    if (statsError) {
      console.error('SHCARD_STATS query error:', statsError);
      return res.status(500).json({
        code: -1,
        message: statsError.message,
        data: null,
      });
    }

    // 전체 데이터 개수 조회
    const { count, error: countError } = await supabase
      .from('SHCARD_STATS')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count query error:', countError);
    }

    const totalCount = count || 0;
    const totalPage = Math.ceil(totalCount / limit);

    // ADDR_INFO 테이블에서 모든 데이터 조회 (조인 키가 없으므로 별도 조회)
    const { data: addrData, error: addrError } = await supabase
      .from('ADDR_INFO')
      .select('gsd_nm, sgg_nm')
      .limit(1);

    if (addrError) {
      console.error('ADDR_INFO query error:', addrError);
    }

    // TPBIZ_INFO 테이블에서 모든 데이터 조회
    const { data: tpbizData, error: tpbizError } = await supabase
      .from('TPBIZ_INFO')
      .select('tpbiz_large_nm, tpbiz_mediaum_nm, tpbiz_small_nm')
      .limit(1);

    if (tpbizError) {
      console.error('TPBIZ_INFO query error:', tpbizError);
    }

    // 데이터 조합 (FK 관계가 없으므로 임시로 첫 번째 항목 사용)
    // 실제 운영 환경에서는 조인 키를 통해 매칭해야 합니다
    const defaultAddr = addrData?.[0] || { gsd_nm: '', sgg_nm: '' };
    const defaultTpbiz = tpbizData?.[0] || { tpbiz_large_nm: '', tpbiz_mediaum_nm: '', tpbiz_small_nm: '' };

    const items = statsData?.map((item: any) => ({
      card_use_ymd: item.card_use_ymd,
      gsd_nm: defaultAddr.gsd_nm,
      sgg_nm: defaultAddr.sgg_nm,
      tpbiz_large_nm: defaultTpbiz.tpbiz_large_nm,
      tpbiz_mediaum_nm: defaultTpbiz.tpbiz_mediaum_nm,
      tpbiz_small_nm: defaultTpbiz.tpbiz_small_nm,
      stml_type: item.stml_type,
      card_use_sum_amt: item.card_use_sum_amt,
      card_use_sum_cnt: item.card_use_sum_cnt,
    })) || [];

    res.status(200).json({
      code: 0,
      message: "OK",
      data: {
        items,
        page: {
          currentPage: page,
          pageSize: limit,
          totalPage,
          totalCount,
        },
      },
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      code: -1,
      message: "Internal server error",
      data: null,
    });
  }
}
