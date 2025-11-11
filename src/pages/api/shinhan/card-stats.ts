import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = 20;
    const lastCardUseYmd = req.query.lastCardUseYmd as string | undefined;
    const lastId = req.query.lastId ? Number(req.query.lastId) : undefined;

    // 페이지 번호 유효성 검사
    if (page < 1 || !Number.isInteger(page)) {
      return res.status(400).json({
        code: -1,
        message: "Invalid page number",
        data: {
          items: [],
          page: {
            currentPage: 1,
            pageSize: limit,
            totalPage: 0,
            totalCount: 0,
          },
        },
      });
    }

    // 전체 데이터 개수 조회 (캐싱을 위해 한 번만 조회)
    const { count, error: countError } = await supabase
      .from('SHCARD_STATS')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count query error:', countError);
      return res.status(500).json({
        code: -1,
        message: countError.message,
        data: null,
      });
    }

    const totalCount = count || 0;
    const totalPage = Math.ceil(totalCount / limit);

    // 페이지가 총 페이지 수를 초과하는 경우 빈 결과 반환
    if (page > totalPage && totalCount > 0) {
      return res.status(200).json({
        code: 0,
        message: "Page out of range",
        data: {
          items: [],
          page: {
            currentPage: page,
            pageSize: limit,
            totalPage,
            totalCount,
          },
        },
      });
    }

    // 커서 기반 페이지네이션: lastCardUseYmd와 lastId가 있으면 사용, 없으면 offset 방식
    let statsQuery = supabase
      .from('SHCARD_STATS')
      .select('card_use_ymd, card_use_sum_amt, card_use_sum_cnt, stml_type, frcs_addr_cd, frcs_tpbiz_cd, id');

    if (lastCardUseYmd && lastId) {
      // 커서 기반: 이전 페이지의 마지막 항목 이후 데이터 조회
      // (card_use_ymd < lastCardUseYmd) OR (card_use_ymd = lastCardUseYmd AND id < lastId)
      statsQuery = statsQuery.or(
        `card_use_ymd.lt.${lastCardUseYmd},and(card_use_ymd.eq.${lastCardUseYmd},id.lt.${lastId})`
      );
    } else {
      // offset 방식: 첫 페이지이거나 커서 정보가 없는 경우
      const offset = (page - 1) * limit;
      statsQuery = statsQuery.range(offset, offset + limit - 1);
    }

    const { data: statsData, error: statsError } = await statsQuery
      .order('card_use_ymd', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit);

    if (statsError) {
      console.error('SHCARD_STATS query error:', statsError);
      return res.status(500).json({
        code: -1,
        message: statsError.message,
        data: null,
      });
    }

    // statsData에서 고유한 addr_cd와 tpbiz_cd 추출
    const addrCodesSet = new Set(statsData?.map(item => item.frcs_addr_cd).filter(Boolean));
    const tpbizCodesSet = new Set(statsData?.map(item => item.frcs_tpbiz_cd).filter(Boolean));
    const addrCodes = Array.from(addrCodesSet);
    const tpbizCodes = Array.from(tpbizCodesSet);

    // ADDR_INFO 테이블에서 필요한 데이터만 조회 (빈 배열 체크)
    let addrData = null;
    if (addrCodes.length > 0) {
      const { data, error: addrError } = await supabase
        .from('ADDR_INFO')
        .select('frcs_addr_cd, gsd_nm, sgg_nm')
        .in('frcs_addr_cd', addrCodes);

      if (addrError) {
        console.error('ADDR_INFO query error:', addrError);
      } else {
        addrData = data;
      }
    }

    // TPBIZ_INFO 테이블에서 필요한 데이터만 조회 (빈 배열 체크)
    let tpbizData = null;
    if (tpbizCodes.length > 0) {
      const { data, error: tpbizError } = await supabase
        .from('TPBIZ_INFO')
        .select('frcs_tpbiz_cd, tpbiz_large_nm, tpbiz_mediaum_nm, tpbiz_small_nm')
        .in('frcs_tpbiz_cd', tpbizCodes);

      if (tpbizError) {
        console.error('TPBIZ_INFO query error:', tpbizError);
      } else {
        tpbizData = data;
      }
    }

    // 조회한 데이터를 Map으로 변환하여 빠른 조회
    const addrMap = new Map(addrData?.map(item => [item.frcs_addr_cd, item]) || []);
    const tpbizMap = new Map(tpbizData?.map(item => [item.frcs_tpbiz_cd, item]) || []);

    // 데이터 조합 (실제 조인 키를 통해 매칭)
    const items = (statsData || []).map((item: any) => {
      // 주소 정보 조회 (없으면 기본값)
      const addr = addrMap.get(item.frcs_addr_cd) || {
        gsd_nm: item.frcs_addr_cd || '',
        sgg_nm: ''
      };

      // 업종 정보 조회 (없으면 기본값)
      const tpbiz = tpbizMap.get(item.frcs_tpbiz_cd) || {
        tpbiz_large_nm: item.frcs_tpbiz_cd || '',
        tpbiz_mediaum_nm: '',
        tpbiz_small_nm: ''
      };

      return {
        card_use_ymd: item.card_use_ymd || '',
        gsd_nm: addr.gsd_nm || '',
        sgg_nm: addr.sgg_nm || '',
        tpbiz_large_nm: tpbiz.tpbiz_large_nm || '',
        tpbiz_mediaum_nm: tpbiz.tpbiz_mediaum_nm || '',
        tpbiz_small_nm: tpbiz.tpbiz_small_nm || '',
        stml_type: parseInt(item.stml_type) || 0,
        card_use_sum_amt: item.card_use_sum_amt || 0,
        card_use_sum_cnt: item.card_use_sum_cnt || 0,
      };
    });

    // 다음 페이지를 위한 커서 정보 (마지막 항목의 card_use_ymd와 id)
    const lastItem = statsData && statsData.length > 0 ? statsData[statsData.length - 1] : null;
    const nextCursor = lastItem
      ? {
          lastCardUseYmd: lastItem.card_use_ymd,
          lastId: lastItem.id,
        }
      : null;

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
        cursor: nextCursor,
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
