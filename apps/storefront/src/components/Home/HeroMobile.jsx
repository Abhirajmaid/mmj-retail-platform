"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import heroAction from "@/src/lib/action/hero.action";

const SlideCard = ({ img, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-2xl">
      <div className="relative w-full h-52 mb-4">
        <Image
          src={img}
          alt="Slide Image"
          width={1500}
          height={1500}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
      <h3 className="text-lg font-semibold p-3 pl-5">{title}</h3>
    </div>
  );
};

const HeroMobile = () => {
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
    <section className="md:hidden flex w-full mt-[80px] justify-center items-center bg-white">
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        slidesPerView={1.2}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        {data?.map((item, index) => (
          <SwiperSlide key={index}>
            <Link href={`${item?.attributes?.url}`}>
              <SlideCard
                img={item?.attributes?.img?.data?.attributes?.url}
                title={item?.attributes?.title}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroMobile;
