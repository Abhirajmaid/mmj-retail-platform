import { Nav } from "@/src/components";

export default function Layout({ children }) {
  return (
    <>
      <Nav />
      <div className="mt-[137px]" />
      {children}
    </>
  );
}
