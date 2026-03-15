import { Footer, MobileTabNav, Nav } from "@/src/components";

export default function PrimaryLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="md:mt-[137px] mt-[20px] bg-white" />
      {children}
      <MobileTabNav />
      <Footer />
    </>
  );
}
