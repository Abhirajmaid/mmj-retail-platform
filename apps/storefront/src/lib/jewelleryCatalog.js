import { jewelleries } from "@/src/data/products";

const categoryConfig = [
  { id: 1, key: "diamond", label: "Diamond" },
  { id: 2, key: "gold", label: "Gold" },
  { id: 3, key: "silver", label: "Silver" },
  { id: 4, key: "bullions", label: "Bullions" },
  { id: 5, key: "jewellery_mens", label: "Mens" },
];

export const getJewelleryCategory = (item) =>
  item?.attributes?.categories?.data?.[0]?.attributes?.category;

export const formatFilterLabel = (value = "") =>
  value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const parseFilterValues = (value) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

export const applyJewelleryFilters = (items = [], filters = {}) => {
  const {
    category,
    productTypes = [],
    metalColors = [],
    metalPurities = [],
  } = filters;

  return items.filter((item) => {
    const itemCategory = getJewelleryCategory(item);
    const itemProductType = item?.attributes?.product_type;
    const itemMetalColor = item?.attributes?.metal_color;
    const itemMetalPurity = item?.attributes?.metal_purity;

    if (category && itemCategory !== category) {
      return false;
    }

    if (productTypes.length && !productTypes.includes(itemProductType)) {
      return false;
    }

    if (metalColors.length && !metalColors.includes(itemMetalColor)) {
      return false;
    }

    if (metalPurities.length && !metalPurities.includes(itemMetalPurity)) {
      return false;
    }

    return true;
  });
};

export const getAvailableFilterOptions = (items = [], category) => {
  const categoryItems = applyJewelleryFilters(items, { category });

  const uniqueValues = (selector) =>
    [...new Set(categoryItems.map(selector).filter(Boolean))].sort();

  return {
    product_type: uniqueValues((item) => item?.attributes?.product_type),
    metal_color: uniqueValues((item) => item?.attributes?.metal_color),
    metal_purity: uniqueValues((item) => item?.attributes?.metal_purity),
  };
};

const buildSubLinks = (categoryKey, categoryId) =>
  getAvailableFilterOptions(jewelleries, categoryKey).product_type.map(
    (productType, index) => ({
      id: Number(`${categoryId}${index + 1}`),
      linkText: formatFilterLabel(productType),
      url: `/jewellery/${categoryKey}?product_type=${productType}`,
    })
  );

export const navLinks = [
  ...categoryConfig.map((category) => ({
    id: category.id,
    linkText: category.label,
    url: `/jewellery/${category.key}`,
    subLinks: buildSubLinks(category.key, category.id),
  })),
  {
    id: 6,
    linkText: "Collections",
    url: "/collections",
  },
];
