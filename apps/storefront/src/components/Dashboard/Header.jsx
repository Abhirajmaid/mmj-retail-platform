import React from "react";
import Logo from "../common/Logo";

const Header = () => {
  return (
    <div className="absolute top-0 left-0 w-full justify-between bg-gray-100 flex border-b">
      <div className="w-[80px] h-auto">
        <Logo />
      </div>
    </div>
  );
};

export default Header;
