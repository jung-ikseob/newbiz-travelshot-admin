import { Divider } from "antd";
import { Home, Monitor, Users, BarChart3, Megaphone, Building2, ShieldCheck } from "lucide-react";
import React from "react";
import Menu, { IMenu } from "./nav";

const mainMenuData: IMenu[] = [
  {
    id: "dashboard",
    name: "대시보드",
    icon: <Home className="w-5 h-5" />,
    // link: {
    //   path: "/",
    // },
  },
  {
    id: "user",
    name: "회원관리",
    icon: <Users className="w-5 h-5" />,
    // link: {
    //   path: "/",
    // },
  },
  {
    id: "statistics",
    name: "통계관리",
    icon: <BarChart3 className="w-5 h-5" />,
    // link: {
    //   path: "/",
    // },
  },
  {
    id: "notice",
    name: "공지관리",
    icon: <Megaphone className="w-5 h-5" />,
    // link: {
    //   path: "/",
    // },
  },
  {
    id: "home",
    name: "제휴사관리",
    icon: <Building2 className="w-5 h-5" />,
    submenu: [
      {
        id: "productList",
        name: "신한 데이터 관리",
        link: {
          path: "/sample/product/list",
        },
      },
    ],
  },
  {
    id: "auth",
    name: "권한관리",
    icon: <ShieldCheck className="w-5 h-5" />,
    // link: {
    //   path: "/",
    // },
  },        
  // {
  //   id: "product",
  //   name: "상품 관리",
  //   icon: <Package2 className="w-5 h-5" />,
  //   submenu: [
  //     {
  //       id: "productList",
  //       name: "상품 목록",
  //       link: {
  //         path: "/sample/product/list",
  //       },
  //     },
  //   ],
  // },
];

const devMenuData: IMenu[] = [
  {
    id: "dev",
    name: "사용 가이드",
    icon: <Monitor className="w-5 h-5" />,
    submenu: [
      {
        name: "폼",
        link: {
          path: "/sample/form",
        },
      },
    ],
  },
];

const MainMenu = () => {
  return (
    <>
      <>
        <Divider orientation="left" plain>
          메인
        </Divider>

        <Menu data={mainMenuData} />
      </>
      {/* <>
        <Divider orientation="left" plain>
          개발
        </Divider>

        <Menu data={devMenuData} />
      </> */}
    </>
  );
};

export default React.memo(MainMenu);
