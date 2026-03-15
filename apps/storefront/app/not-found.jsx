import { Footer } from "@/src/components";
import React from "react";

const NotFound = () => {
  return (
    <div>
      <div className="w-full bg-sec h-[20px]"></div>
      <div className="bg-primary">
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="text-8xl font-bold text-white">404</h1>
          <p className="text-4xl font-medium text-white">Page Not Found</p>
          <a href="/" className="mt-4 text-xl text-blue-400 hover:underline">
            Go back home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
