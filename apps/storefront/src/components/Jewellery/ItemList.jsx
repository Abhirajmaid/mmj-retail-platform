import React, { Suspense } from "react";
import ProductCard from "../common/ProductCard";

const ItemList = ({ data }) => {
  return (
    <>
      <div className="flex flex-wrap gap-6 items-center justify-start w-full md:w-[1425px] mx-auto md:px-4 px-4 ">
        {data?.map((item, id) => {
          return (
            <div key={id} className="w-[330px]">
              <ProductCard item={item} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ItemList;
