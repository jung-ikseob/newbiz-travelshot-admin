import { useCardStats } from "@/client/shinhan/card-stats";
import DefaultTable from "@/components/shared/ui/default-table";
import { ICardStats } from "@/types/shinhan-card";
import { Alert, Row, Col, Spin } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import numeral from "numeral";
import { useCallback, useEffect, useMemo, lazy, Suspense, memo } from "react";
import { formatCardUseDate, formatStmlType } from "@/utils/chart-helpers";

// 코드 스플리팅: 차트 컴포넌트들을 동적으로 로드하여 초기 로딩 속도 향상
const OnlineOfflineChart = lazy(() => import("./charts/online-offline-chart"));
const IndustryChart = lazy(() => import("./charts/industry-chart"));
const RegionMapChart = lazy(() => import("./charts/region-map-chart"));

// 차트 로딩 중 표시할 컴포넌트
const ChartLoadingFallback = memo(() => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <Spin size="large" />
  </div>
));

ChartLoadingFallback.displayName = "ChartLoadingFallback";

const CardStatsList = () => {
  const router = useRouter();
  const currentPage = router.query.page ? Number(router.query.page) : 1;
  const { data, error, isLoading, mutate } = useCardStats({ page: currentPage });

  // 페이지 변경 시 강제로 데이터 리페치
  useEffect(() => {
    mutate();
  }, [currentPage, mutate]);

  // 유효하지 않은 페이지 접근 시 첫 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && data?.data) {
      const totalPages = data.data.page.totalPage;
      const totalCount = data.data.page.totalCount;

      // 데이터가 없거나 현재 페이지가 유효 범위를 벗어난 경우
      if (totalCount === 0 || currentPage > totalPages || currentPage < 1) {
        router.replace({
          pathname: router.pathname,
          query: { page: 1 },
        });
      }
    }
  }, [isLoading, data, currentPage, router]);

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
      render: (value: string) => formatCardUseDate(value),
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
      render: (value: number) => formatStmlType(value),
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
      {/* 통계 차트 섹션 - Suspense로 감싸서 코드 스플리팅 적용 */}
      <Row gutter={[16, 16]} className="mb-6" style={{ minHeight: '400px' }}>
        <Col xs={24} lg={8} style={{ minHeight: '400px' }}>
          <Suspense fallback={<ChartLoadingFallback />}>
            <OnlineOfflineChart />
          </Suspense>
        </Col>
        <Col xs={24} lg={8} style={{ minHeight: '400px' }}>
          <Suspense fallback={<ChartLoadingFallback />}>
            <IndustryChart />
          </Suspense>
        </Col>
        <Col xs={24} lg={8} style={{ minHeight: '400px' }}>
          <Suspense fallback={<ChartLoadingFallback />}>
            <RegionMapChart />
          </Suspense>
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
          record
            ? `${currentPage}-${index}-${record.card_use_ymd || ''}-${record.card_use_sum_amt || 0}`
            : `${currentPage}-${index}-empty`
        }
      />
    </>
  );
};

export default memo(CardStatsList);
