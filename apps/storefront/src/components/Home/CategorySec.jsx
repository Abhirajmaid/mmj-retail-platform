import { categories } from "@/src/data/categories";
import React from "react";
import { SectionTitle } from "..";
import Image from "next/image";
import Link from "next/link";

const CategoryCard = ({ category, btnLink, detail, img }) => {
  return (
    <div className="md:w-[300px] w-[170px] h-auto md:p-6 p-3 pb-6 hover:bg-secondary_light md:bg-transparent flex flex-col justify-between items-center">
      <div>
        <Image
          src={img}
          width={1500}
          height={1500}
          className="md:h-full h-32 object-cover"
          alt="mmj"
          priority
        />
      </div>
      <div className="flex flex-col gap-4 items-center mt-4 md:mt-none">
        <h2 className="md:text-[21px] text-[19px] font-semibold">{category}</h2>
        <p className="md:text-auto text-[14px] text-center">{detail}</p>
        <Link href={`${btnLink}`}>
          <button className=" uppercase p-3 px-4 border-black border-[0.7px] text-black  hover:bg-primary hover:text-txt_light tracking-wider text-[12px]">
            Discover More
          </button>
        </Link>
      </div>
    </div>
  );
};

const CategorySec = () => {
  return (
    <section className="md:w-[1412px] w-full mx-auto flex flex-col items-center justify-center mt-12">
      <div>
        <SectionTitle
          title="Shop by Category"
          subTitle="A one-stop shop for all of your jewellery needs!"
          txtColor="black"
        />
      </div>
      <div className="flex flex-wrap md:gap-4 gap-6 w-full md:justify-between mt-[20px] md:px-5 justify-center">
        {categories.map((item, id) => {
          return <CategoryCard {...item} key={id} />;
        })}
      </div>
    </section>
  );
};

export default CategorySec;
