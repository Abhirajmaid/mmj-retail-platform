import React from "react";
import { SectionTitle } from "..";
import { mensCat } from "@/src/data/categories";
import Image from "next/image";
import Link from "next/link";

const SectionCard = ({ category, btnLink, img }) => {
  return (
    <div className="md:w-[300px] w-[170px] h-auto p-3 pb-5 hover:bg-secondary_light md:bg-transparent bg-secondary_light flex flex-col justify-between items-center">
      <Image
        src={img}
        width={500}
        height={500}
        className="w-full h-full object-cover mb-6"
        alt="mmj"
      />
      <div className="flex flex-col gap-4 items-center">
        <h2 className="md:text-[21px] text-[18px]">{category}</h2>
        <Link href={`${btnLink}`}>
          <button className=" uppercase md:p-3 p-2 px-4 border-black border-[0.7px] text-black  hover:bg-primary hover:text-txt_light tracking-wider text-[12px]">
            Discover More
          </button>
        </Link>
      </div>
    </div>
  );
};

const MensSec = () => {
  return (
    <section className="md:w-[1412px] w-full mx-auto flex flex-col items-center justify-center mt-12">
      <div>
        <SectionTitle
          title="Men’s Jewellery"
          subTitle="Prepare to elevate your sense of style with our latest collection!"
          txtColor="black"
        />
      </div>
      <div className="flex flex-wrap md:flex-nowrap md:gap-7 gap-4 w-full md:justify-between mt-[20px] justify-center">
        {mensCat.map((item, id) => {
          return <SectionCard {...item} key={id} />;
        })}
      </div>
    </section>
  );
};

export default MensSec;
