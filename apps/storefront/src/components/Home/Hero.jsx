"use client";
import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import heroAction from "@/src/lib/action/hero.action";

const Slide = ({ img }) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Image
        src={img}
        width={1920}
        height={1080}
        className="w-full h-full object-cover"
        alt="mmj"
        priority
      />
    </div>
  );
};

const Hero = () => {
  const [data, setData] = useState();

  useEffect(() => {
    getHeroImgList();
  }, []);

  const getHeroImgList = () => {
    heroAction
      .getHeroImages()
      .then((resp) => {
        setData(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <section className="w-full min-h-[80vh] md:block hidden">
      <Swiper
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper h-full"
      >
        {data?.map((item, key) => {
          return (
            <SwiperSlide key={key} className="h-full">
              <Link href={`${item?.attributes?.url}`} className="w-full h-full">
                <Slide img={item?.attributes?.img?.data?.attributes?.url} />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Hero;
