import { Banner, Filters, HeroMobile } from "@/src/components";
import React from "react";

export const metadata = {
  title: "Jewellery | Mukund Maid Jewellers",
  description:
    "Explore our extensive range of jewellery at Mukund Maid Jewellers, including rings, necklaces, and bracelets.",
};

const layout = ({ children }) => {
  return (
    <>
      <Banner />
      <HeroMobile />
      <Filters />
      {children}
    </>
  );
};

export default layout;
