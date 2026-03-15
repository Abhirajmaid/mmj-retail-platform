// // pages/index.js
// "use client";
// // pages/index.js
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const plants = [
//   {
//     name: "Browningia Hertlingiana",
//     description: "The juvenile specimens have a beautiful blue frosty covering",
//     image: "/plant1.png",
//   },
//   {
//     name: "Chlorophytum Comosum",
//     description: "Spider plant with vibrant green leaves",
//     image: "/plant2.png",
//   },
//   {
//     name: "Dracaena Trifasciata",
//     description: "Snake plant that thrives indoors",
//     image: "/plant3.png",
//   },
//   {
//     name: "Crassula Ovata",
//     description: "Known as the jade plant",
//     image: "/plant4.png",
//   },
//   {
//     name: "Haworthiopsis Attenuata",
//     description: "Small succulent perfect for beginners",
//     image: "/plant5.png",
//   },
// ];

// export default function Home() {
//   const [currentPlantIndex, setCurrentPlantIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentPlantIndex((prevIndex) => (prevIndex + 1) % plants.length);
//     }, 4000); // Change plant every 4 seconds
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-[#e9f0eb] min-h-screen">
//       {/* Navbar */}
//       <header className="w-full p-6 bg-white shadow-md">
//         <nav className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="font-semibold text-xl">Go Green</div>
//           <ul className="flex space-x-8 text-gray-700">
//             <li>
//               <a href="#" className="hover:text-green-500">
//                 Home
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-green-500">
//                 Plant Finder
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-green-500">
//                 Products
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-green-500">
//                 About Us
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-green-500">
//                 Contact
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-green-500">
//                 My Plants
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </header>

//       {/* Main Section */}
//       <main className="max-w-7xl mx-auto py-16 px-8 flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
//         {/* Left Side Content */}
//         <div className="lg:w-1/2 text-center lg:text-left space-y-4">
//           <h1 className="text-5xl font-bold text-gray-800">
//             The world of plants
//           </h1>
//           <p className="text-gray-600">
//             Discover everything you need to know about your plants, treat them
//             with kindness and they will take care of you.
//           </p>
//         </div>

//         {/* Plant Display with Growing Effect */}
//         <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
//           <div className="flex space-x-6">
//             {/* Small Plants on the Right */}
//             <div className="flex flex-col space-y-4">
//               {plants.map((plant, index) => (
//                 <motion.div
//                   key={index}
//                   onClick={() => setCurrentPlantIndex(index)}
//                   className={`cursor-pointer transition-all duration-500 ${
//                     index === currentPlantIndex ? "scale-110" : "scale-90"
//                   }`}
//                 >
//                   <img
//                     src={plant.image}
//                     alt={plant.name}
//                     className="w-20 h-20 object-contain rounded-full shadow-lg"
//                   />
//                 </motion.div>
//               ))}
//             </div>

//             {/* Larger Plant on the Left */}
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentPlantIndex}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 transition={{ duration: 0.8 }}
//                 className="bg-white shadow-lg p-6 rounded-lg max-w-sm text-center space-y-4"
//               >
//                 <img
//                   src={plants[currentPlantIndex].image}
//                   alt={plants[currentPlantIndex].name}
//                   className="w-full h-64 object-contain"
//                 />
//                 <h2 className="text-2xl font-semibold">
//                   {plants[currentPlantIndex].name}
//                 </h2>
//                 <p className="text-gray-500">
//                   {plants[currentPlantIndex].description}
//                 </p>
//                 <button className="text-green-600 hover:text-green-500">
//                   Know more →
//                 </button>
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </main>

//       {/* Top 5 Section */}
//       <section className="bg-white py-10">
//         <div className="max-w-7xl mx-auto px-8">
//           <h3 className="text-xl font-semibold mb-4">Top 5 of the week</h3>
//           <div className="flex space-x-4 overflow-x-scroll">
//             {plants.map((plant, index) => (
//               <div
//                 key={index}
//                 className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center"
//               >
//                 <img
//                   src={plant.image}
//                   alt={plant.name}
//                   className="w-24 h-24 object-cover rounded-full mb-2"
//                 />
//                 <p className="text-gray-700 font-medium">{plant.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

import React from "react";

const page = () => {
  return (
    <div class="min-h-screen bg-[#EDF7F4]">
      <nav class="flex justify-between items-center px-10 py-4">
        <ul class="flex space-x-8 text-gray-700 font-semibold">
          <li>
            <a href="#" class="hover:text-gray-900">
              Home
            </a>
          </li>
          <li>
            <a href="#" class="hover:text-gray-900">
              Plant Finder
            </a>
          </li>
          <li>
            <a href="#" class="hover:text-gray-900">
              Products
            </a>
          </li>
          <li>
            <a href="#" class="hover:text-gray-900">
              About us
            </a>
          </li>
          <li>
            <a href="#" class="hover:text-gray-900">
              Contact
            </a>
          </li>
          <li>
            <a href="#" class="hover:text-gray-900">
              My plants
            </a>
          </li>
        </ul>
        <div class="flex space-x-4 text-gray-700">
          <i class="fas fa-search"></i>
          <i class="fas fa-user"></i>
          <i class="fas fa-shopping-cart"></i>
        </div>
      </nav>

      <section class="px-10 py-16 flex items-center space-x-10">
        <div class="flex-1">
          <h2 class="text-green-700 text-lg font-semibold mb-4">Go green.</h2>
          <h1 class="text-6xl font-bold text-gray-800 leading-tight mb-6">
            The world of plants
          </h1>
          <p class="text-lg text-gray-600 mb-8">
            Discover everything you need to know about your plants, treat them
            with kindness and they will take care of you.
          </p>
        </div>

        <div class="relative flex-1 bg-white rounded-2xl p-8 shadow-lg">
          <img
            src="https://via.placeholder.com/150"
            alt="Plant Image"
            class="w-40 mx-auto -mt-20 mb-4"
          />
          <h3 class="text-2xl font-bold text-gray-700 mb-2 text-center">
            Browningia Hertlingiana
          </h3>
          <p class="text-gray-500 text-center mb-4">
            The juvenile specimens have a beautiful blue frosty covering.
          </p>
          <a href="#" class="text-green-600 font-semibold text-center block">
            Know more →
          </a>
        </div>
      </section>

      <section class="px-10 py-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          Top 5 of the week
        </h3>
        <div class="grid grid-cols-5 gap-6">
          <div class="bg-white rounded-lg p-4 shadow text-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Chlorophytum Comosum"
              class="w-24 h-24 mx-auto mb-4"
            />
            <h4 class="text-lg font-bold text-gray-700">
              Chlorophytum Comosum
            </h4>
          </div>

          <div class="bg-white rounded-lg p-4 shadow text-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Dracaena Trifasciata"
              class="w-24 h-24 mx-auto mb-4"
            />
            <h4 class="text-lg font-bold text-gray-700">
              Dracaena Trifasciata
            </h4>
          </div>

          <div class="bg-white rounded-lg p-4 shadow text-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Crassula Ovata"
              class="w-24 h-24 mx-auto mb-4"
            />
            <h4 class="text-lg font-bold text-gray-700">Crassula Ovata</h4>
          </div>

          <div class="bg-white rounded-lg p-4 shadow text-center">
            <img
              src="https://via.placeholder.com/100"
              alt="Haworthiopsis Attenuata"
              class="w-24 h-24 mx-auto mb-4"
            />
            <h4 class="text-lg font-bold text-gray-700">
              Haworthiopsis Attenuata
            </h4>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
