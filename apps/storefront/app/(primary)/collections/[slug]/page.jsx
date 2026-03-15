"use client";
import { ItemList, Loader } from "@/src/components";
import { Toast } from "@/src/context/ToastContext";
import collectionAction from "@/src/lib/action/collection.action";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const param = useParams();

  const [data, setData] = useState();

  const { error } = Toast();

  useEffect(() => {
    getJewelleryList();
  }, []);

  const getJewelleryList = () => {
    collectionAction
      .getCollection()
      .then((resp) => {
        setData(resp.data.data);
      })
      .catch((e) => {
        console.log(e);
        error("Error fetching data!");
      });
  };

  const dataFiltered = data?.find((item) => {
    return item?.attributes?.slug == param.slug;
  });

  // Access jewelleries inside the collection
  const jewelleries = dataFiltered?.attributes?.jewelleries?.data;

  console.log(jewelleries);

  return (
    <>
      {jewelleries ? (
        <div className="py-[100px]">
          <ItemList data={jewelleries} />
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default page;
