"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

const images = [
  { id: 1, src: "/1.png", name: "Gold Necklace", rotate: "-rotate-12" },
  { id: 2, src: "/2.png", name: "Diamond Ring", rotate: "-rotate-6" },
  { id: 3, src: "/3.png", name: "Silver Bracelet", rotate: "rotate-0" },
  { id: 4, src: "/4.png", name: "Emerald Earrings", rotate: "rotate-6" },
  { id: 5, src: "/5.png", name: "Ruby Pendant", rotate: "rotate-12" },
];

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [notFavorites, setNotFavorites] = useState([]);

  const swiped = (direction) => {
    const currentImage = images[currentIndex];

    if (direction === "right") {
      setFavorites([...favorites, currentImage]);
      console.log(true, currentImage.src); // Log true and image address
    } else if (direction === "left") {
      setNotFavorites([...notFavorites, currentImage]);
    }

    // Only increment index if it hasn't reached the last image
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Swipeable handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => swiped("left"),
    onSwipedRight: () => swiped("right"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Optional, allows swiping with mouse too
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <div
        className="relative w-full max-w-md h-[500px] mb-8"
        {...swipeHandlers}
      >
        {currentIndex < images.length ? (
          images.slice(currentIndex).map((image, index) => (
            <div
              key={image.id}
              className={`absolute w-full h-full bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300`}
              style={{ zIndex: images.length - index }}
            >
              <img
                src={image.src}
                alt={image.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="text-center mt-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#0A2874]">
              No more images!
            </h2>
            <p className="mt-4 text-base md:text-lg">
              Favorites: {favorites.length}
            </p>
            <p className="mt-2 text-base md:text-lg">
              Not Favorites: {notFavorites.length}
            </p>
          </div>
        )}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => swiped("left")}
          className="bg-[#c7d7ff] border border-primary text-primary p-3 md:p-4 rounded-full shadow-md text-sm md:text-base"
          disabled={currentIndex >= images.length}
        >
          <Icon icon="lucide:x" className="w-8 h-8" />
        </button>
        <button
          onClick={() => swiped("right")}
          className="bg-[#c7d7ff] border border-primary text-primary p-3 md:p-4 rounded-full shadow-md text-sm md:text-base"
          disabled={currentIndex >= images.length}
        >
          <Icon icon="lucide:check" className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Page;
