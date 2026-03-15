"use client";
import React, { useEffect, useState } from "react";
import { SectionTitle } from "..";
import notificationAction from "@/src/lib/action/notification.action";

const NotificationCard = ({ notify, key }) => {
  return (
    <div className="bg-bg_dark p-3 rounded-lg relative flex w-full">
      <h2 className="text-black">{notify}</h2>
      {true ? (
        <>
          <span className="animate-ping absolute h-4 w-4 -top-1 -left-1 rounded-full bg-red-500 opacity-75"></span>
          <span className="absolute  h-4 w-4 -top-1 -left-1 rounded-full bg-red-500"></span>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const NotificationContainer = () => {
  const [data, setData] = useState();

  useEffect(() => {
    getNotifyList();
  }, []);

  const getNotifyList = () => {
    notificationAction
      .getNotification()
      .then((resp) => {
        setData(resp.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="relative w-[18%] border-l px-3 pb-10 pt-3">
      <div className="mb-10">
        <SectionTitle title="Notifications" txtColor="black" />
      </div>
      <div className="flex flex-col gap-4">
        {data &&
          data?.map((item, id) => {
            return (
              <NotificationCard
                notify={item?.attributes?.notification}
                key={id}
              />
            );
          })}
      </div>
    </div>
  );
};

export default NotificationContainer;
