"use client";
import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { heroSlides } from "@/src/data/hero";

const Slide = ({ img }) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Image
        src={img}
        width={500}
        height={500}
        className="w-full h-full object-cover -translate-y-[260px]"
        alt="mmj"
        priority
      />
    </div>
  );
};

const Banner = () => {
  return (
    <section className="hidden md:block w-full max-h-[40vh] overflow-hidden">
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
        className="mySwiper"
      >
        {heroSlides.map((item, key) => {
          return (
            <SwiperSlide key={key}>
              <Link href={`${item.url}`} className="w-full h-full">
                <Slide img={item.img} />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Banner;
