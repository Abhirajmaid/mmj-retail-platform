"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const gold_rate = 6984;

const ProductCard = ({ item }) => {
  let price = gold_rate * (item?.attributes?.weight ?? 0);
  price += price * ((item?.attributes?.making_charges ?? 0) / 100);
  price += price * ((item?.attributes?.tax ?? 0) / 100);

  // console.log(item);

  return (
    <Link
      href={`/items/${item?.attributes?.product_code}`}
      className="cursor-pointer w-full"
    >
      <div className="relative w-full h-auto hover:bg-secondary_light flex flex-col overflow-hidden border-[0.7px] border-[#424242]/30 rounded-lg">
        <div className="w-full h-[280px]">
          <Image
            src={item?.attributes?.img?.data[0]?.attributes?.url}
            width={500}
            unoptimized={true}
            height={500}
            className="w-full h-full object-cover"
            alt="MMJ"
            priority
          />
        </div>
        <div className="flex flex-col gap-1 items-start justify-center px-2 py-1 font-semibold">
          <h2 className="text-primary text-[18px]">₹{Math.round(price)}</h2>
          <span className="text-[13px] tracking-wider">
            SKU:{item?.attributes?.product_code}
          </span>
        </div>
        <div className="absolute w-[35px] h-[35px] bg-white flex items-center justify-center rounded-full cursor-pointer top-3 right-3">
          <Icon icon="bi:heart" width={22} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
