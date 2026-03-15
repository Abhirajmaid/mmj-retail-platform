import React from "react";
import { SectionTitle } from "..";
import Image from "next/image";
import Link from "next/link";

const DiamondSec = () => {
  return (
    <section className="md:w-[1400PX] w-[90%] mx-auto">
      <div>
        <SectionTitle
          title="Diamond"
          subTitle="Discover the beauty of diamond with our timeless diamond collection"
          txtColor="black"
        />
      </div>
      <div className="grid grid-cols-3 md:grid-rows-2 grid-rows-5 md:grid-flow-col grid-flow-row gap-4 md:h-[650px] h-[900px] mt-[30px]">
        <Link
          href="/jewellery/diamond?product_type=rings"
          className="md:row-span-1 col-span-3 bg-black rounded-lg overflow-hidden"
        >
          <Image
            src="/statics/diamond/1.png"
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </Link>
        <Link
          href="/jewellery/diamond?product_type=bangles"
          className="md:row-span-1 col-span-3 bg-black rounded-lg overflow-hidden"
        >
          <Image
            src="/statics/diamond/2.png"
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </Link>
        <Link
          href="/jewellery/diamond"
          className="md:row-span-2 col-span-3 bg-black rounded-lg overflow-hidden"
        >
          <Image
            src="/statics/diamond/3.png"
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </Link>
        <Link
          href="/jewellery/diamond?product_type=earrings"
          className="md:row-span-1 col-span-3 bg-black rounded-lg overflow-hidden"
        >
          <Image
            src="/statics/diamond/4.png"
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </Link>
        <Link
          href="/jewellery/diamond?product_type=mangalsutras"
          className="md:row-span-1 col-span-3 bg-black rounded-lg overflow-hidden"
        >
          <Image
            src="/statics/diamond/5.png"
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </Link>
      </div>
    </section>
  );
};

export default DiamondSec;
