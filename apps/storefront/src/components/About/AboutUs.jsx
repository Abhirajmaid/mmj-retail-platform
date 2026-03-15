"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@jewellery-retail/ui";
// import { aboutData } from "@src/data/data";
import Link from "next/link";
import { Icon } from "@iconify/react";

const AboutUs = () => {
  return (
    <div className="bg-white md:mt-[180px] mt-[50px]">
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1552642762-f55d06580015?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        // subheading="Customer-Centric Care."
        heading="Customer-Centric Care."
      >
        <Content1 />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1632157256334-518122d788bd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        // subheading="Variety, Built for all of us."
        heading="Variety, Built for all of us."
      >
        <Content2 />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1595691403533-7f4a52a5b189?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHN1cGVyYmlrZXN8ZW58MHx8MHx8fDA%3D"
        // subheading="Modern"
        heading="Quality, Never Compromise"
      >
        <Content3 />
      </TextParallaxContent>
    </div>
  );
};

const IMG_PADDING = 12;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const Content1 = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
      Personalised assistance, Every step of the way.
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-neutral-600 md:text-2xl">
        At NetGarage, we believe in providing more than just motorcycles – we're
        here to offer you exceptional service tailored to your needs. Our team
        is dedicated to providing personalized assistance at every step of your
        journey, whether you're browsing our inventory or finalizing your
        purchase.
      </p>
      <p className="mb-8 text-xl text-neutral-600 md:text-2xl">
        From answering your questions to guiding you through the buying process,
        we're committed to ensuring that your experience with us is smooth and
        satisfying. Trust NetGarage for attentive service that puts you, the
        customer, first.
      </p>
      <Link href="/contact-us">
        <Button variant="primary" className="w-[30%] bg-primary text-white p-7">
          Learn more <Icon icon="lucide:arrow-up-right" className="inline" />
        </Button>
      </Link>
    </div>
  </div>
);
const Content2 = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
      An extensive array of motorcycles, catering to every rider's taste and
      preference.
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-neutral-600 md:text-2xl">
        Wether you love speed and just want to lean into every corner of the
        track with a super bike or you fancy going on the roads less travelled
        on your adventure bike, or maybe all you want is a reliable yet powerful
        bike to do your daily commute.
      </p>
      <p className="mb-8 text-xl text-neutral-600 md:text-2xl">
        At Netgarage we have it all, find your dream moto lifestyle with our
        wide variety of pre-owned motorcycles. Our commitment to variety means
        you'll have ample choices to explore and find the motorcycle that
        perfectly matches your style and riding preferences.
      </p>
      <Link href="/contact-us">
        <Button variant="primary" className="w-[30%] bg-primary text-white p-7">
          Learn more <Icon icon="lucide:arrow-up-right" className="inline" />
        </Button>
      </Link>
    </div>
  </div>
);
const Content3 = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
      Hand picked sellers, Unparalleled quality
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-neutral-600 md:text-2xl">
        We're dedicated to bringing you top-notch pre-owned motorcycles. We
        partner with trusted resellers who have a stellar track record for
        maintaining quality in their inventory. Rest assured, when you browse
        our selection, you're getting bikes that have met stringent standards.
        Your satisfaction and safety are paramount to us. So, hop on and explore
        our collection with confidence, knowing that quality is always at the
        forefront at NetGarage.
      </p>
      <Link href="/contact-us">
        <Button variant="primary" className="w-[30%] bg-primary text-white p-7">
          Learn more <Icon icon="lucide:arrow-up-right" className="inline" />
        </Button>
      </Link>
    </div>
  </div>
);

export default AboutUs;
