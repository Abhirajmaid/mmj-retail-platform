"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import jewelleryAction from "@/src/lib/action/jewellery.action";
import {
  applyJewelleryFilters,
  formatFilterLabel,
  getAvailableFilterOptions,
  parseFilterValues,
} from "@/src/lib/jewelleryCatalog";

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const [data, setData] = useState([]);

  const [selectedFilters, setSelectedFilters] = useState({
    product_type: [],
    metal_color: [],
    metal_purity: [],
  });

  const [dropdowns, setDropdowns] = useState({
    product_type: false,
    metal_color: false,
    metal_purity: false,
  });

  useEffect(() => {
    jewelleryAction.getJewellery().then((resp) => {
      setData(resp.data.data);
    });
  }, []);

  useEffect(() => {
    setSelectedFilters({
      product_type: parseFilterValues(searchParams.get("product_type")),
      metal_color: parseFilterValues(searchParams.get("metal_color")),
      metal_purity: parseFilterValues(searchParams.get("metal_purity")),
    });
  }, [searchParams]);

  const toggleDropdown = (filterName) => {
    setDropdowns((prevState) => ({
      ...prevState,
      [filterName]: !prevState[filterName],
    }));
  };

  const toggleSelection = (filterName, option) => {
    setSelectedFilters((prevState) => {
      const currentSelections = prevState[filterName];
      if (currentSelections?.includes(option)) {
        return {
          ...prevState,
          [filterName]: currentSelections.filter((item) => item !== option),
        };
      } else {
        return {
          ...prevState,
          [filterName]: [...currentSelections, option],
        };
      }
    });
  };

  const generateQueryString = () => {
    const query = {};

    Object.keys(selectedFilters).forEach((filter) => {
      if (selectedFilters[filter].length > 0) {
        query[filter] = selectedFilters[filter].join(",");
      }
    });

    return query;
  };

  const applyFilters = () => {
    const queryString = generateQueryString();
    const searchParams = new URLSearchParams(queryString).toString();
    router.push(searchParams ? `${pathname}?${searchParams}` : pathname);
  };

  const filterOptions = useMemo(
    () => getAvailableFilterOptions(data, params?.category),
    [data, params?.category]
  );

  const filteredCount = useMemo(
    () =>
      applyJewelleryFilters(data, {
        category: params?.category,
        productTypes: selectedFilters.product_type,
        metalColors: selectedFilters.metal_color,
        metalPurities: selectedFilters.metal_purity,
      }).length,
    [data, params?.category, selectedFilters]
  );

  return (
    <div className="w-full lg:w-[75%] mx-auto px-4 py-2 z-[99] mt-[50px] md:mt-0">
      <div className="w-full flex flex-col lg:flex-row justify-between border-b border-[#242424] py-4 mb-6">
        <div className="flex flex-col items-start gap-4 justify-between w-full lg:w-auto">
          <h2 className="text-lg font-semibold">Jewellery ({filteredCount})</h2>
          <div className="flex flex-wrap gap-4 lg:gap-6">
            {Object.keys(filterOptions).map((filter) => (
              <div className="relative" key={filter}>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700"
                  onClick={() => toggleDropdown(filter)}
                >
                  <span>{filter.toUpperCase().replace("_", " ")}</span>
                  <Icon
                    icon={`teenyicons:${
                      dropdowns[filter] ? "up" : "down"
                    }-solid`}
                    width={16}
                  />
                </button>
                {dropdowns[filter] && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-[99]">
                    <ul className="py-1 text-gray-700">
                      {filterOptions[filter].map((option) => (
                        <li
                          key={option}
                          className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                            selectedFilters[filter]?.includes(option)
                              ? "bg-gray-200"
                              : ""
                          }`}
                          onClick={() => toggleSelection(filter, option)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters[filter]?.includes(option)}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => toggleSelection(filter, option)}
                            className="mr-2"
                          />
                          {filter === "product_type"
                            ? formatFilterLabel(option)
                            : option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="mt-4 lg:mt-0 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
