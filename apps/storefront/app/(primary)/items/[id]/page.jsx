"use client";
import {
  CTA,
  Divider,
  ItemList,
  JewelleryDetails,
  Loader,
  SectionTitle,
} from "@/src/components";
import jewelleryAction from "@/src/lib/action/jewellery.action";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const getPrimaryCategory = (item) =>
  item?.attributes?.categories?.data?.[0]?.attributes?.category;

const getRelatedItems = (items, currentItem) => {
  const currentCategory = getPrimaryCategory(currentItem);
  const currentFeature = currentItem?.attributes?.feature;
  const currentCode = currentItem?.attributes?.product_code;

  const rankedItems = items
    .filter((item) => item?.attributes?.product_code !== currentCode)
    .map((item) => ({
      item,
      score:
        (getPrimaryCategory(item) === currentCategory ? 2 : 0) +
        (item?.attributes?.feature === currentFeature ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  return rankedItems.slice(0, 4).map(({ item }) => item);
};

const page = () => {
  const param = useParams();

  const [data, setData] = useState();
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    getJewelleryDetails();
  }, [param?.id]);

  const getJewelleryDetails = () => {
    jewelleryAction
      .getJewelleryByProductCode(param.id)
      .then((resp) => {
        const currentItems = resp.data.data;
        const currentItem = currentItems?.[0];

        setData(currentItems);

        if (!currentItem) {
          setRelatedItems([]);
          return;
        }

        jewelleryAction.getJewellery().then((listResp) => {
          setRelatedItems(getRelatedItems(listResp.data.data, currentItem));
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full">
      {data ? (
        <>
          <JewelleryDetails data={data} />
        </>
      ) : (
        <Loader />
      )}
      <Divider />
      <SectionTitle title="You May Like This" txtColor="black" />
      <Divider />
      {relatedItems.length ? (
        <div className="py-8">
          <ItemList data={relatedItems} />
        </div>
      ) : null}
      <CTA />
    </div>
  );
};

export default page;
