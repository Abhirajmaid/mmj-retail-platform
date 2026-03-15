import { jewelleries } from "@/src/data/products";

const toCollectionImage = (product) => ({
  data: {
    attributes: {
      url: product.attributes.img.data[0].attributes.url,
    },
  },
});

export const collections = [
  {
    id: 1,
    attributes: {
      title: "Bridal Glow",
      slug: "bridal-glow",
      url: "bridal-glow",
      img: toCollectionImage(jewelleries[0]),
      jewelleries: {
        data: jewelleries.filter(
          (item) => item.attributes.collection === "bridal-glow"
        ),
      },
    },
  },
  {
    id: 2,
    attributes: {
      title: "Diamond Daily",
      slug: "diamond-daily",
      url: "diamond-daily",
      img: toCollectionImage(jewelleries[1]),
      jewelleries: {
        data: jewelleries.filter(
          (item) => item.attributes.collection === "diamond-daily"
        ),
      },
    },
  },
  {
    id: 3,
    attributes: {
      title: "Men's Power",
      slug: "mens-power",
      url: "mens-power",
      img: toCollectionImage(jewelleries[4]),
      jewelleries: {
        data: jewelleries.filter(
          (item) => item.attributes.collection === "mens-power"
        ),
      },
    },
  },
];
