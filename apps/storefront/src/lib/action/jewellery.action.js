import { jewelleries } from "@/src/data/products";

const getJewellery = async () => ({ data: { data: jewelleries } });

const getJewelleryByProductCode = async (product_code) => ({
  data: {
    data: jewelleries.filter(
      (item) => item?.attributes?.product_code === product_code
    ),
  },
});

export default {
  getJewellery,
  getJewelleryByProductCode,
};