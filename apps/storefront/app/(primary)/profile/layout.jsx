import { SideNavbar } from "@/src/components";
import { userAccLinks } from "@/src/lib/navLinks";

const ProfileLayout = ({ children }) => {
  return (
    <>
      <div className="md:mt-[80px] mt-[30px] min-h-screen max-h-screen w-full overflow-hidden bg-white flex">
        <SideNavbar links={userAccLinks} />
        <div className="w-full md:p-8 p-4 bg-gray-100">{children}</div>
      </div>
    </>
  );
};

export default ProfileLayout;
