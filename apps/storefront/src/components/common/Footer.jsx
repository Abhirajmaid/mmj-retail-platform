import Image from "next/image";
import React from "react";
import Logo from "./Logo";
import { customerLinks, jewelleryCatLinks } from "@/src/lib/navLinks";
import { SingleLink } from "..";

const Footer = () => {
  return (
    <footer className="relative w-full h-full pt-[45px] md:px-[130px] px-4 bg-[#e9b020]/50 overflow-hidden">
      <Image
        src="/statics/footer_bg.png"
        width={400}
        height={500}
        className="absolute object-cover w-full top-0 left-0 opacity-10"
        alt="footer"
      />
      <div className="grid md:grid-cols-4 grid-cols-2 grid-rows-2 md:grid-rows-1 w-[90%] gap-5 mx-auto opacity-100 z-50">
        <div className="w-full">
          <div className="w-[115px] h-[100px]">
            <Logo />
          </div>
          <h3 className="md:text-[22px] text-[20px] flex flex-col mt-[30px]">
            Connect With Us!
            <span className="w-[10%] h-[2px] bg-black"></span>
          </h3>
        </div>
        <div className="w-full">
          <h3 className="md:text-[22px] text-[20px] flex flex-col">
            For Customers
            <span className="w-[10%] h-[2px] bg-black"></span>
          </h3>
          <ul className="flex flex-col gap-2 items-start justify-start mt-3">
            {customerLinks.map((link) => (
              <SingleLink {...link} key={link.id} />
            ))}
          </ul>
        </div>
        <div className="w-full">
          <h3 className="md:text-[22px] text-[20px] flex flex-col">
            Jewellery Categories
            <span className="w-[10%] h-[2px] bg-black"></span>
          </h3>
          <ul className="flex flex-col gap-2 items-start justify-start mt-3">
            {jewelleryCatLinks.map((link) => (
              <SingleLink {...link} key={link.id} />
            ))}
          </ul>
        </div>
        <div className="w-full">
          <h3 className="md:text-[22px] text-[20px] flex flex-col">
            Get in Touch
            <span className="w-[10%] h-[2px] bg-black"></span>
          </h3>
          <p className="mt-3 md:text-[16px] text-[14px]">
            customerservice@mmj.com
            <br />
            +919822672923 /+917385302967
            <br />
            (10am to 6pm) Tuesday to Sunday
            <br />
            *Monday Closed
          </p>
        </div>
      </div>
      <div className="w-full justify-center items-center flex mt-[40px] mb-[130px] md:mt-[120px] md:mb-[30px]">
        <span>©2024 MM Jewellery. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
