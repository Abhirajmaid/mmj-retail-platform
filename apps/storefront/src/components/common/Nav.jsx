"use client";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { navLinks } from "../../lib/navLinks";
import { Logo, SingleLink } from "..";
import Link from "next/link";
import { RateLink } from "./RateDropDown";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@jewellery-retail/ui";

import { deleteCookie, hasCookie } from "cookies-next";

const Nav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) => pathname == href;

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (hasCookie("jwt")) {
      setIsLogin(true);
    }
  }, []);

  const onSignOut = () => {
    sessionStorage.clear();
    deleteCookie("jwt");
    router.push("/sign-in");
  };

  return (
    <nav className="w-full fixed z-50 top-0 left-0 border-b">
      <div className="w-full md:px-10 px-6 md:py-2 py-1 flex justify-between items-center text-[13px] bg-primary text-txt_light">
        <div className="w-[40%] flex gap-4 items-center">
          <Link
            href="https://wa.me/7385302967"
            target="_blank"
            className="flex items-center gap-1 font-semibold"
          >
            <Icon icon="ic:sharp-whatsapp" width="20" />
            <span className="md:block hidden">WhatsApp</span>
          </Link>
          <Link
            href="#storeLocation"
            className="flex items-center gap-1 font-semibold"
          >
            <Icon icon="ic:outline-store" width="20" />
            <span className="md:block hidden">Store Locator</span>
          </Link>
        </div>
        <RateLink />
      </div>
      <div className="w-full justify-between bg-white text-black md:flex hidden">
        <div className="w-[130px] h-[110px]">
          <Logo />
        </div>
        <div className="flex flex-col gap-3 w-[35%] justify-center items-center">
          <input
            type="text"
            className="w-[100%] p-[10px] px-6 border border-[#C1C1C1] rounded-3xl placeholder:italic placeholder:text-sm"
            placeholder="What are you looking for?"
          />
          <ul className="flex gap-8 items-center w-auto justify-center">
            {navLinks.map((link) => (
              <SingleLink {...link} key={link.id} isActive={isActive} />
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-6 mr-10 text-[15px]">
          {isLogin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer font-semibold">
                  <Icon icon="lucide:user-round" width={20} />
                  <span>Account</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile/favorites">My Favorites</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSignOut()}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={"/sign-in"}>
              <button className="flex items-center gap-2 bg-primary w-full text-white p-3 px-4 capitalize cursor-pointer">
                Log In
              </button>
            </Link>
          )}
          <div>
            <Link
              href="/profile/favorites"
              className="flex items-center gap-1 font-semibold"
            >
              <Icon icon="lucide:heart" width={20} />
              <span>Favorites</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
