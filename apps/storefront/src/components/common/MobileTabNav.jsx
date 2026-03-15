"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileTabNav = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { name: "Home", icon: "lucide:home", id: "/", url: "/" },
    {
      name: "Store",
      icon: "lucide:layout-grid",
      id: "/jewellery",
      url: "/jewellery",
    },
    {
      name: "Gallery",
      icon: "lucide:gallery-horizontal-end",
      id: "/gallery",
      url: "/gallery",
    },
    {
      name: "Favorites",
      icon: "lucide:heart",
      id: "/profile/favorites",
      url: "/profile/favorites",
    },
    {
      name: "Profile",
      icon: "lucide:user-round",
      id: "/profile",
      url: "/profile",
    },
  ];

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  return (
    <div className="z-[99] md:hidden fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center p-4 rounded-t-3xl shadow-[0px_-19px_30px_1px_rgba(0,_0,_0,_0.1)]">
      {tabs.map((tab) => (
        <Link
          href={tab.url}
          key={tab.id}
          className="flex flex-col items-center"
        >
          <div
            className={`p-2 rounded-full ${
              activeTab === tab.id ? "bg-primary" : "bg-white"
            }`}
          >
            <Icon
              icon={tab.icon}
              className={`h-6 w-6 ${
                activeTab === tab.id ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab.id)}
            />
          </div>
          <p
            className={`mt-1 text-xs ${
              activeTab === tab.id ? "text-primary font-bold" : "text-gray-400"
            }`}
          >
            {tab.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default MobileTabNav;
