"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import metalRateAction from "@/src/lib/action/metalRate.action";

// const rates = [
//   {
//     metal: "Silver",
//     rate: "89",
//   },
//   {
//     metal: "24KT",
//     rate: "7,178",
//   },
//   {
//     metal: "22KT",
//     rate: "6,673",
//   },
//   {
//     metal: "18KT",
//     rate: "5,618",
//   },
//   {
//     metal: "14KT",
//     rate: "4,400",
//   },
// ];

const UpdatedAtComponent = ({ updatedAt }) => {
  // Convert updatedAt string to a Date object
  const date = new Date(updatedAt);

  // Format the date and time
  const formattedDate = date.toLocaleDateString(); // e.g., "8/25/2024"
  const formattedTime = date.toLocaleTimeString(); // e.g., "12:34:56 PM"

  return (
    <p className="text-[16px] w-full text-start">
      Updated At: <br /> {formattedDate} {formattedTime}
    </p>
  );
};

const RateDropDown = ({ data }) => {
  return (
    <motion.div
      className="flex flex-col items-center bg-white text-black p-4 shadow-lg w-full border-black/30 border"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ ease: "easeInOut", duration: 0.3 }}
    >
      <h3 className="text-[22px] font-light">Today's Gold Rate</h3>
      <span className="w-[80%] mt-[10px] mb-[18px] h-[1px] bg-sec"></span>
      <ul className="gap-[15px] flex flex-col w-full mb-[22px]">
        {data?.map((item, id) => (
          <div key={id} className="flex justify-between items-center">
            <span className="font-light text-[18px]">
              {item?.attributes?.name}
            </span>
            <span className="font-medium text-[16px]">
              ₹{item?.attributes?.rate}
            </span>
          </div>
        ))}
      </ul>
      <span className="w-[80%] mb-[18px] h-[1px] bg-sec"></span>
      <div className="text-[14px] w-full text-start">
        {data && (
          <UpdatedAtComponent updatedAt={data[0]?.attributes?.updatedAt} />
        )}
      </div>
    </motion.div>
  );
};

export const RateLink = () => {
  const [open, setOpen] = useState(false);

  const [data, setData] = useState();

  useEffect(() => {
    getRateList();
  }, []);

  const getRateList = () => {
    metalRateAction.getMetalRates().then((resp) => {
      setData(resp.data.data);
    });
  };

  return (
    <>
      <div
        className="relative w-fit h-fit "
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex items-center gap-1 font-semibold cursor-pointer">
          <Icon icon="streamline:gold" width="17" className="-mt-2" />
          <span>Metal Rates</span>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute right-[50%] top-6 z-50 w-[270px] cursor-pointer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent " />
              <RateDropDown data={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
