import {
  CategorySec,
  DiamondSec,
  Divider,
  FeaturedSec,
  GallerySec,
  Hero,
  HeroMobile,
  MensSec,
  PromisesSec,
  StoreLocationSec,
  StoryCarousel,
} from "@/src/components";

export default function Home() {
  return (
    <>
      <div className="mb-[110px] md:mb-0">
        <HeroMobile />
        <Hero />
        <StoryCarousel />
        <CategorySec />
        <Divider />
        <PromisesSec />
        <FeaturedSec />
        <Divider />
        <DiamondSec />
        <Divider />
        <MensSec />
        <Divider />
        <StoreLocationSec />
        <Divider />
        <GallerySec />
      </div>
    </>
  );
}
