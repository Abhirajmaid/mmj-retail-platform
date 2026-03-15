import { collections } from "@/src/data/collections";

const getCollection = async () => ({ data: { data: collections } });

export default {
  getCollection,
};