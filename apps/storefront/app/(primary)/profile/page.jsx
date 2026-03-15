"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import userAction from "@/src/lib/action/user.action";
import { Toast } from "@/src/context/ToastContext";
import { Loader } from "@/src/components";
import { deleteCookie } from "cookies-next";

const ProfilePage = () => {
  const router = useRouter();

  const { warn } = Toast();

  const [user, setUser] = useState();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    const token = JSON.parse(sessionStorage.getItem("jwt"));

    userAction
      .fetchLoggedInUser(token)
      .then((resp) => {
        setUser(resp.data);
      })
      .catch((error) => {
        console.log(error);
        warn(error);
      });
  };

  const onSignOut = () => {
    sessionStorage.clear();
    deleteCookie("jwt");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto md:p-6 p-2">
        {/* Header */}
        <div className="flex justify-between md:items-center gap-4 items-start border-b border-gray-300 pb-4 mb-6 md:flex-row flex-col">
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <div onClick={() => onSignOut()} className=" cursor-pointer">
            <span className="flex items-center text-sm text-gray-600 hover:text-black">
              <Icon icon="lucide:log-out" className="h-5 w-5" />
              LOG OUT
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 grid-rows-2 gap-8">
          {/* Account Details */}
          <div className="border border-gray-300 p-6 bg-white">
            <h2 className="text-lg font-bold mb-4">ACCOUNT DETAILS</h2>
            {user ? (
              <div className="text-sm text-gray-600">
                <p>{user?.username}</p>
                <p>{user?.email}</p>
                <p>{user?.mobile_number}</p>
                <p>India</p>
              </div>
            ) : (
              <Loader />
            )}
          </div>

          {/* Order History */}
          <div className="border border-gray-300 p-6 bg-white">
            <h2 className="text-lg font-bold mb-4">ORDER HISTORY</h2>
            <div className="text-sm text-gray-600">
              <p>YOU HAVEN'T PLACED ANY ORDERS YET.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
