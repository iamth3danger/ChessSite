import React from "react";
import { IconType } from "react-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
interface HeaderItemProps {
  name: string;
  link: string;
  Icon: IconType;
}

//<Link to={link} className='hidden md:block'>{name}</Link>

function HeaderItem({ name, link, Icon }: HeaderItemProps) {
  return (
    <div className="text-white text-[18px] font-semibold cursor-pointer hover:underline underline-offset-8 pb-2 pt-2">
      <Link to={link} className="flex items-center gap-4 cursor-pointer hover:underline underline-offset-8">
        <Icon />
      <h2 className="hidden md:block">{name}</h2>
      </Link>
    </div>
  );
}

export default HeaderItem;
