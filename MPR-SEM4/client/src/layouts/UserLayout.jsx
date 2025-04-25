import React from "react";
import { Outlet } from "react-router";

import UserNavbar from "../components/UserNavbar";

const UserLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Floating Navbar */}
      <UserNavbar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto  bg-gray-100 mt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;