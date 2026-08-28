import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/ConsumerHeader";
import Sidebar from "../components/ConsumerSidebar";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content */}
      <main
        className={`pt-[76px] min-h-screen transition-all duration-300 ${
          collapsed ? "ml-[75px]" : "ml-[220px]"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;