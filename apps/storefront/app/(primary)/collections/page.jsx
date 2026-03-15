import { ComingSoon } from "@/src/components";
import CollectionGrid from "@/src/components/Collection/CollectionGrid";
import React from "react";

export const metadata = {
  title: "Collections | Mukund Maid Jewellers",
  description:
    "Discover exclusive jewellery collections at Mukund Maid Jewellers, showcasing timeless elegance and luxury.",
};

const page = () => {
  return (
    <>
      <CollectionGrid />
    </>
  );
};

export default page;
