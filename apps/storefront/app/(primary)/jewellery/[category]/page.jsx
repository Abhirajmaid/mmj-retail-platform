"use client";
import { ItemList, Loader, PaginationControls } from "@/src/components";
import { Toast } from "@/src/context/ToastContext";
import jewelleryAction from "@/src/lib/action/jewellery.action";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  applyJewelleryFilters,
  parseFilterValues,
} from "@/src/lib/jewelleryCatalog";

const page = () => {
  const param = useParams();

  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "12";

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const product_type = searchParams.get("product_type");
  const metal_color = searchParams.get("metal_color");
  const metal_purity = searchParams.get("metal_purity");

  const [data, setData] = useState();

  const { warn } = Toast();

  useEffect(() => {
    getJewelleryList();
  }, [param?.category]);

  const getJewelleryList = () => {
    jewelleryAction
      .getJewellery()
      .then((resp) => {
        setData(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
        warn(error);
      });
  };

  const dataFiltered = applyJewelleryFilters(data, {
    category: param?.category,
    productTypes: parseFilterValues(product_type),
    metalColors: parseFilterValues(metal_color),
    metalPurities: parseFilterValues(metal_purity),
  });

  const dataSliced = dataFiltered?.slice(start, end);

  // console.log("filter", dataFiltered);

  // console.log("haa", dataSliced);

  return (
    <>
      {data ? (
        <>
          <ItemList data={dataSliced} />
          <PaginationControls count={dataFiltered?.length ?? 0} />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default page;
