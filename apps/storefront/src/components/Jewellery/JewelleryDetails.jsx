"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ProductImages } from "..";

const gold_rate = 6984;

const JewelleryDetails = ({ data }) => {
  const [price, setPrice] = useState("");
  const [netTax, setNetTax] = useState("");

  useEffect(() => {
    var gold_price = gold_rate * data[0]?.attributes?.weight;
    gold_price += gold_price * (data[0]?.attributes?.making_charges / 100);
    var net_tax = gold_price * (data[0]?.attributes?.tax / 100);
    gold_price += net_tax;

    setNetTax(net_tax);
    setPrice(gold_price);
  }, [data]);

  return (
    <section className="flex flex-col lg:flex-row w-full lg:w-[90%] xl:w-[1430px] mx-auto p-3 pt-[80px] gap-10">
      <div className="relative w-full lg:w-[50%] flex items-end flex-col">
        <ProductImages images={data[0]?.attributes?.img?.data} />
        <div className="absolute w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-[#f5f5f5] p-[2px] flex items-center justify-center rounded-full cursor-pointer top-5 right-5">
          <Icon icon="bi:heart" width={24} md-width={28} />
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-[50%]">
        <h1 className="text-[20px] md:text-[24px] font-semibold mb-3">
          {data[0]?.attributes?.title}
        </h1>
        <h2 className="text-[16px] md:text-[18px] mb-3">
          Product Code: {data[0]?.attributes?.product_code}
        </h2>
        <p className="text-[14px] md:text-[15px] mb-5">
          Availability: {data[0]?.attributes?.availability}
        </p>
        <div className="flex flex-col mb-5">
          <div className="text-[24px] md:text-[27px] text-primary font-bold">
            ₹{Math.round(price)}
          </div>
          <span className="text-[11px]">(Including all charges)</span>
        </div>
        <div className="flex flex-col md:flex-row items-center w-full lg:w-[80%] mb-6 gap-4 md:gap-0">
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <p className="text-[16px]">Metal Purity</p>
            <div className="w-full p-3 bg-[#f5f5f5] border-[0.7px] border-primary text-center font-semibold">
              {data[0]?.attributes?.metal_purity}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <p className="text-[16px]">Metal Color</p>
            <div className="w-full p-3 bg-[#f5f5f5] border-[0.7px] border-primary text-center font-semibold">
              {data[0]?.attributes?.metal_color}
            </div>
          </div>
        </div>
        <div className="bg-[#f5f5f5] w-full mb-6 border border-primary p-4">
          <h3 className="text-[14px] pb-4">View price breakup</h3>
          <ul className="gap-[10px] flex flex-col w-full mb-[22px] text-[14px]">
            <div className="flex w-full justify-between items-center">
              <span className="w-1/3">Metal Price</span>
              <span className="w-1/3 text-center">
                {data[0]?.attributes?.weight}gm
              </span>
              <span className="w-1/3 text-end">
                ₹
                {Math.round(gold_rate * data[0]?.attributes?.weight * 100) /
                  100}
              </span>
            </div>
            <div className="flex w-full justify-between items-center">
              <span className="w-1/3">Stone Price</span>
              <span className="w-1/3 text-center">-</span>
              <span className="w-1/3 text-end">₹200</span>
            </div>
            <div className="flex w-full justify-between items-center">
              <span className="w-1/3">Making Charges</span>
              <span className="w-1/3 text-center">
                {data[0]?.attributes?.making_charges}%
              </span>
              <span className="w-1/3 text-end">
                ₹
                {Math.round(
                  gold_rate *
                    data[0]?.attributes?.weight *
                    (data[0]?.attributes?.making_charges / 100) *
                    100
                ) / 100}
              </span>
            </div>
            <div className="flex w-full justify-between items-center">
              <span className="w-1/3">Tax (GST)</span>
              <span className="w-1/3 text-center">
                {data[0]?.attributes?.tax}%
              </span>
              <span className="w-1/3 text-end">
                ₹{Math.round(netTax * 100) / 100}
              </span>
            </div>
            <span className="w-full my-[10px] h-[1px] bg-black"></span>
            <div className="flex w-full justify-between items-center">
              <span className="w-1/3">Net Price</span>
              <span className="w-1/3 text-center"></span>
              <span className="w-2/3 text-end">₹{Math.round(price)}</span>
            </div>
          </ul>
        </div>
        <div className="flex flex-col md:flex-row w-full lg:w-[90%] gap-5 text-[15px] mb-6">
          <Link href="/" className="w-full md:w-[40%]">
            <button className="btn btn-primary hover:bg-primary hover:scale-[1.05] transition-all w-full !rounded-none !p-4">
              💛 Add to Favorite
            </button>
          </Link>
          <Link href="/" className="w-full md:w-[40%]">
            <button className="btn btn-primary hover:bg-primary hover:scale-[1.05] transition-all w-full !rounded-none !p-4">
              Buy Now
            </button>
          </Link>
        </div>
        <Image
          src="/statics/contact_details.svg"
          width={700}
          height={300}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
};

export default JewelleryDetails;
