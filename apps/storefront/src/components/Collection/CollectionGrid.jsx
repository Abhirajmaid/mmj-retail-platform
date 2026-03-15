"use client";
import collectionAction from "@/src/lib/action/collection.action";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CollectionGrid = () => {
  const [data, setData] = useState();

  useEffect(() => {
    getCollectionList();
  }, []);

  const getCollectionList = () => {
    collectionAction
      .getCollection()
      .then((resp) => {
        setData(resp.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <section className="container mx-auto py-10">
      <h1 className="text-[42px] font-semibold mb-6">Our Collection</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {data?.map((item, id) => (
          <Link
            href={`/collections/${item?.attributes?.url}`}
            key={id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={item?.attributes?.img?.data?.attributes?.url}
              alt="MMJ"
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                {item?.attributes?.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionGrid;
