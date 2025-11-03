import { ChevronDown, ChevronUp } from "lucide-react";
import { message } from "antd";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { IMenu, isEqualPath } from ".";
import NavItem from "./nav-item";

interface INavMenuProps {
  menu: IMenu;
}

const NavMenu = ({ menu }: INavMenuProps) => {
  const router = useRouter();
  const [isShowSubMenu, setIsShowSubMenu] = useState(
    menu.submenu && menu.submenu.length > 0 && menu.submenu.find((v) => (v.isActive || isEqualPath)(router, v.link))
      ? true
      : false
  );

  const handleParentClick = useCallback(() => {
    // submenu가 있으면 토글
    if (menu.submenu && menu.submenu.length > 0) {
      setIsShowSubMenu(!isShowSubMenu);
    } else {
      // submenu가 없고 link도 없으면 '준비 중입니다'
      if (!menu.link || !menu.link.path || menu.link.path === "/") {
        message.info("준비 중입니다");
      }
    }
  }, [menu, isShowSubMenu]);

  if (menu.submenu) {
    return (
      <li>
        <a onClick={handleParentClick}>
          {menu.icon}
          <span className="cursor-pointer grow">{menu.name}</span>
          {menu.submenu && menu.submenu.length > 0 ? (
            isShowSubMenu ? (
              <ChevronUp className="w-6 h-6 text-gray-500" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-500" />
            )
          ) : (
            <></>
          )}
        </a>
        <ul className={isShowSubMenu ? "block" : "hidden"}>
          {menu.submenu.map((sub) => {
            return <NavItem key={sub.name} item={sub} />;
          })}
        </ul>
      </li>
    );
  }

  return <NavItem item={menu} />;
};

export default React.memo(NavMenu);
