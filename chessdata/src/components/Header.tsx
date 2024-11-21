import React from "react";
import HeaderItem from "./HeaderItem";
import { HiOutlineUser } from "react-icons/hi";
import { FaChessBoard, FaChessKnight, FaChess } from "react-icons/fa";
function Header() {
  const menu = [
    {
      name: "Data",
      link: "/data",
      Icon: FaChessKnight,
    },
    {
      name: "Global",
      link: "/global",
      Icon: FaChess,
    },
    {
      name: "Analysis",
      link: "/analysis",
      Icon: FaChessBoard,
    },
    {
      name: "",
      link: "/login",
      Icon: HiOutlineUser,
    },
  ];

  return (
     <header className="bg-black text-white border-b border-white/20">
      <nav className="container mx-auto px-2 sm:px-4">
        <ul className="flex items-center justify-between">
          {menu.map((item) => (
            <li key={item.name} className="flex-1">
              <HeaderItem name={item.name} Icon={item.Icon} link={item.link} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
