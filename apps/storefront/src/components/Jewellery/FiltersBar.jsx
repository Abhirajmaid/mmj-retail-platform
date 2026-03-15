"use client";
import jewelleryAction from "@/src/lib/action/jewellery.action";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";

const FiltersBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [data, setData] = useState();

  // Function to toggle dropdown visibility
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  useEffect(() => {
    getJewelleryList();
  }, []);

  const getJewelleryList = () => {
    jewelleryAction.getJewellery().then((resp) => {
      console.log(resp.data.data);
      setData(resp.data.data);
    });
  };

  return (
    <div className="w-[75%] mx-auto px-4 py-2">
      <div className="flex flex-col items-start gap-4 justify-between border-b border-[#242424] py-4 mb-6">
        <h2 className="text-lg font-semibold">Jewellery ({data?.length})</h2>
        <div className="flex space-x-6">
          <div className="relative">
            <button
              onClick={() => toggleDropdown("productType")}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700"
            >
              <span>PRODUCT TYPE</span>
              <Icon icon="teenyicons:down-solid" width={16} />
            </button>
            {openDropdown === "productType" && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-[99]">
                <ul className="py-1 text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Rings
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Necklaces
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Bracelets
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleDropdown("price")}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700"
            >
              <span>PRICE</span>
              <Icon icon="teenyicons:down-solid" width={16} />
            </button>
            {openDropdown === "price" && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    ₹0 - ₹5,000
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    ₹5,000 - ₹10,000
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    ₹10,000 - ₹20,000
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleDropdown("metalColor")}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700"
            >
              <span>METAL COLOR</span>
              <Icon icon="teenyicons:down-solid" width={16} />
            </button>
            {openDropdown === "metalColor" && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Yellow Gold
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    White Gold
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Rose Gold
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleDropdown("metalPurity")}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700"
            >
              <span>METAL PURITY</span>
              <Icon icon="teenyicons:down-solid" width={16} />
            </button>
            {openDropdown === "metalPurity" && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    24 Karat
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    22 Karat
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    18 Karat
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    12 Karat
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => toggleDropdown("weightRange")}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700"
            >
              <span>WEIGHT RANGE</span>
              <Icon icon="teenyicons:down-solid" width={16} />
            </button>
            {openDropdown === "weightRange" && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    0 - 10 grams
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    0 - 10 grams
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    10 - 20 grams
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    20 - 30 grams
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="relative">
            <button className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <span>MORE FILTERS</span>
              <Icon icon="teenyicons:down-solid" width={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
