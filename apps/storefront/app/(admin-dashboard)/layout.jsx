import { Header, NotificationContainer, SideNavbar } from "@/src/components";
import { adminNavLinks } from "@/src/lib/navLinks";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="mt-[80px] min-h-screen md:max-h-screen w-full overflow-hidden bg-white flex">
        <SideNavbar links={adminNavLinks} />
        <div className="md:w-[82%] w-full md:p-8 p-4 ">{children}</div>
        <NotificationContainer />
      </div>
    </>
  );
};

export default DashboardLayout;
