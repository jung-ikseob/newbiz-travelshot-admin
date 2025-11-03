import { getDefaultLayout, IDefaultLayoutPage, IPageHeader } from "@/components/layout/default-layout";
import CardStatsList from "@/components/page/shinhan/card-stats-list";

const pageHeader: IPageHeader = {
  title: "신한 데이터 관리",
};

const CardStatsPage: IDefaultLayoutPage = () => {
  return (
    <>
      <CardStatsList />
    </>
  );
};

CardStatsPage.getLayout = getDefaultLayout;
CardStatsPage.pageHeader = pageHeader;

export default CardStatsPage;
