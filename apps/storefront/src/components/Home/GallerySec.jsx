import Image from "next/image";
import React from "react";

const images = [
  "https://images.unsplash.com/photo-1689367436442-76c859315008?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1629118639934-2b241503956c?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1689367436791-5af208e5e081?q=80&w=1988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1709033511355-d2b8d7e86797?q=80&w=1949&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1610213665246-eb2df074f8e6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1705326453292-f3d35cd96514?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1705326452395-1d35e6add570?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1705326455036-0fab8ecba04d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const GallerySec = () => {
  const randomNumberInRange = () => {
    return Math.floor(Math.random() * (7 - 0 + 1)) + 0;
  };

  return (
    <section className="w-full">
      <div className="hidden w-full h-[700px] md:grid columns-4 grid-rows-2 grid-flow-col gap-1 bg-black">
        <div className=" row-span-1 bg-black overflow-hidden">
          <Image
            src={images[randomNumberInRange()]}
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </div>
        <div className=" row-span-1 bg-black overflow-hidden">
          <Image
            src={images[randomNumberInRange()]}
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </div>
        <div className=" row-span-2 bg-black overflow-hidden">
          <Image
            src={images[randomNumberInRange()]}
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </div>
        <div className=" row-span-1 bg-black overflow-hidden">
          <Image
            src={images[randomNumberInRange()]}
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </div>
        <div className=" row-span-1 bg-black overflow-hidden">
          <Image
            src={images[randomNumberInRange()]}
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </div>
        <div className=" row-span-2 bg-black overflow-hidden">
          <Image
            src={images[randomNumberInRange()]}
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </div>
        <div className=" row-span-1 bg-black overflow-hidden">
          <Image
            src={images[randomNumberInRange()]}
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </div>
        <div className=" row-span-1 bg-black overflow-hidden">
          <Image
            src={images[randomNumberInRange()]}
            width={500}
            height={500}
            className="object-cover h-full w-full"
            alt="mmj"
          />
        </div>
      </div>
    </section>
  );
};

export default GallerySec;
