import { ContactForm } from "@/src/components";
import Image from "next/image";
import React from "react";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Mukund Maid Jewellers for all your jewellery needs and inquiries.",
};

const page = () => {
  return (
    <>
      <div className="relative w-full md:h-[110vh] h-[150vh]">
        <Image
          src="/statics/contact_us.jpg"
          width={1500}
          height={1500}
          alt="MMJ"
          className="w-full h-full object-cover blur-[6px] "
        />
        <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-black/50 md:px-[6%]">
          <div className="md:mt-14 md:w-[60%] w-[90%] md:h-[72vh] h-fit rounded-xl mx-auto flex md:flex-row flex-col items-center gap-6 bg-white overflow-hidden">
            <div className="md:w-[40%] w-full h-full">
              <Image
                src="/contact_us.jpg"
                width={1500}
                height={1500}
                alt="MMJ"
                className="object-cover h-full w-full"
              />
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
