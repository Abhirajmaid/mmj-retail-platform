import React from "react";
import { SectionTitle } from "..";
import Image from "next/image";

const PromisesSec = () => {
  return (
    <section className="w-full p-6 flex flex-col items-center gap-4 bg-primary">
      <div>
        <SectionTitle
          title="MMJ Promises"
          subTitle="Incredible rationales to shop with us!"
          txtColor="white"
        />
      </div>
      <Image
        src="/statics/promises.svg"
        width={700}
        height={700}
        className="md:w-[85%] md:h-[170px] w-[100%] h-[80px]"
        alt="MMJ"
      />
    </section>
  );
};

export default PromisesSec;
