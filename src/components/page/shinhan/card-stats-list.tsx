import { useCardStats } from "@/client/shinhan/card-stats";
import DefaultTable from "@/components/shared/ui/default-table";
import { ICardStats } from "@/types/shinhan-card";
import { Alert, Row, Col } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import numeral from "numeral";
import { useCallback, useEffect, useMemo } from "react";
import OnlineOfflineChart from "./charts/online-offline-chart";
import IndustryChart from "./charts/industry-chart";
import RegionMapChart from "./charts/region-map-chart";

const CardStatsList = () => {
  const router = useRouter();
  const currentPage = router.query.page ? Number(router.query.page) : 1;
  const { data, error, isLoading, mutate } = useCardStats({ page: currentPage });

  // 페이지 변경 시 강제로 데이터 리페치
  useEffect(() => {
    mutate();
  }, [currentPage, mutate]);

  // 데이터가 변경될 때마다 새로운 배열 참조 생성
  const tableData = useMemo(() => {
    console.log('Page:', currentPage, 'Items count:', data?.data.items?.length);
    return data?.data.items || [];
  }, [data, currentPage]);

  const handleChangePage = useCallback(
    (pageNumber: number) => {
      router.push({
        pathname: router.pathname,
        query: { page: pageNumber },
      });
    },
    [router]
  );

  const columns: ColumnsType<ICardStats> = [
    {
      title: "카드사용시점",
      dataIndex: "card_use_ymd",
      width: 120,
      align: "center",
      render: (value: string) => {
        // YYYYMMDD 형식을 YYYY-MM-DD로 변환
        if (value && value.length === 8) {
          return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
        }
        return value;
      },
    },
    {
      title: "소재지(시도)",
      dataIndex: "gsd_nm",
      width: 100,
      align: "center",
    },
    {
      title: "소재지(시군구)",
      dataIndex: "sgg_nm",
      width: 120,
      align: "center",
    },
    {
      title: "업종(대)",
      dataIndex: "tpbiz_large_nm",
      width: 120,
      align: "center",
    },
    {
      title: "업종(중)",
      dataIndex: "tpbiz_mediaum_nm",
      width: 150,
      align: "center",
    },
    {
      title: "업종(소)",
      dataIndex: "tpbiz_small_nm",
      width: 150,
      align: "center",
    },
    {
      title: "온오프라인",
      dataIndex: "stml_type",
      width: 100,
      align: "center",
      render: (value: number) => {
        return value === 1 ? "온라인" : "오프라인";
      },
    },
    {
      title: "카드이용금액계",
      dataIndex: "card_use_sum_amt",
      width: 150,
      align: "center",
      render: (value: number) => {
        return <span>{numeral(value).format("0,0")}원</span>;
      },
    },
    {
      title: "카드이용건수계",
      dataIndex: "card_use_sum_cnt",
      width: 120,
      align: "center",
      render: (value: number) => {
        return <span>{numeral(value).format("0,0")}건</span>;
      },
    },
  ];

  if (error) {
    console.error('Card stats error:', error);
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" />;
  }

  return (
    <>
      {/* 통계 차트 섹션 */}
      <Row gutter={[16, 16]} className="mb-6" style={{ minHeight: '400px' }}>
        <Col xs={24} lg={8} style={{ minHeight: '400px' }}>
          <OnlineOfflineChart />
        </Col>
        <Col xs={24} lg={8} style={{ minHeight: '400px' }}>
          <IndustryChart />
        </Col>
        <Col xs={24} lg={8} style={{ minHeight: '400px' }}>
          <RegionMapChart />
        </Col>
      </Row>

      {/* 데이터 테이블 */}
      <DefaultTable<ICardStats>
        columns={columns}
        dataSource={tableData}
        loading={isLoading}
        pagination={{
          current: currentPage,
          defaultPageSize: 20,
          pageSize: 20,
          total: data?.data.page.totalCount || 0,
          showSizeChanger: false,
          onChange: handleChangePage,
        }}
        className="mt-3"
        countLabel={data?.data.page.totalCount}
        rowKey={(record, index) =>
          `${currentPage}-${index}-${record.card_use_ymd}-${record.card_use_sum_amt}`
        }
      />
    </>
  );
};

export default CardStatsList;
