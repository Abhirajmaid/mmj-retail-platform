import Image from "next/image";
import Link from "next/link";
import React from "react";

const StoreLocationSec = () => {
  return (
    <section
      id="storeLocation"
      className="w-full flex md:flex-row flex-col md:gap-[60px] gap-[20px] items-center justify-center bg-primary text-white"
    >
      <Image
        src="/statics/mmjstore.png"
        width={500}
        height={500}
        className="md:w-[50%] w-full"
        alt="Mukund Maid Jewellers"
      />
      <div className="flex flex-col md:p-0 p-8 justify-start gap-5">
        <h2 className="w-full md:text-[32px] text-[22px] flex flex-col">
          Come and Say Hi!
          <span className="w-[7%] h-[3px] bg-white"></span>
        </h2>
        <p className="md:text-[18px] text-[14px] font-thin md:w-[60%] w-full">
          Explore iconic traditional jewellery, gold and diamond engagement
          rings, silver classics, elegant accessories, and precious gifts for
          any occasion at our MMJ store.
        </p>
        <Link href="https://maps.app.goo.gl/ttGrwNSfCm5hRny49" target="_blank">
          <button className="bg-sec md:w-[20%] w-auto text-black p-3 uppercase cursor-pointer">
            Store Location
          </button>
        </Link>
      </div>
    </section>
  );
};

export default StoreLocationSec;
