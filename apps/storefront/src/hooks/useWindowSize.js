"use client"
import React, { useState } from "react";

export function useWindScreenowSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  React.useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}
