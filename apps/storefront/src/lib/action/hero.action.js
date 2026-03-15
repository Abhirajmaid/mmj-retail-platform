import { heroSlidesApi } from "@/src/data/hero";

const getHeroImages = async () => ({ data: { data: heroSlidesApi } });

export default {
  getHeroImages,
};