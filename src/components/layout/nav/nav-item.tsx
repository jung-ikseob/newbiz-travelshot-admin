import { ChevronRight } from "lucide-react";
import { message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { IMenu, isEqualPath } from ".";

interface INavItemProps {
  item: IMenu;
}

const NavItem = ({ item }: INavItemProps) => {
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent) => {
    // link가 없거나 path가 없으면 '준비 중입니다' 메시지 표시
    if (!item.link || !item.link.path || item.link.path === "/") {
      e.preventDefault();
      message.info("준비 중입니다");
    }
  }, [item.link]);

  return (
    <li>
      <Link
        href={{
          pathname: item.link?.path ?? "/",
          query: item.link?.query,
        }}
        className={(item.isActive || isEqualPath)(router, item.link) ? "active" : ""}
        onClick={handleClick}
      >
        {item.icon}
        <span className="cursor-pointer grow">{item.name}</span>
        <ChevronRight className="w-6 h-6 text-white active-check" />
      </Link>
    </li>
  );
};

export default React.memo(NavItem);
