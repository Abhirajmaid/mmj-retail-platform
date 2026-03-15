"use client";

import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="md:w-[550px] w-full h-auto">
      <div className="w-full h-auto">
        <Image
          src={images[index]?.attributes?.url}
          alt="MMJ"
          width={1500}
          height={1500}
          className="w-full h-[500px] object-cover border border-sec"
          priority
        />
      </div>
      <div className="flex justify-between gap-4 mt-8 w-full">
        {images.map((item, i) => (
          <div
            className="w-1/4 h-32 gap-4 mt-5 cursor-pointer"
            key={i}
            onClick={() => setIndex(i)}
          >
            <Image
              src={item?.attributes?.url}
              alt="MMJ"
              width={500}
              height={500}
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
