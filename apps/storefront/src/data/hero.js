export const heroSlides = [
  {
    title: "MMJ Signature Collection",
    img: "/statics/hero.png",
    url: "/",
  },
  {
    title: "New Diamond Arrivals",
    img: "/statics/hero.png",
    url: "/jewellery/diamond",
  },
  {
    title: "Wedding Jewellery Edit",
    img: "/statics/hero.png",
    url: "/collections",
  },
];

export const heroSlidesApi = heroSlides.map((slide, index) => ({
  id: index + 1,
  attributes: {
    title: slide.title,
    url: slide.url,
    img: {
      data: {
        attributes: {
          url: slide.img,
        },
      },
    },
  },
}));
