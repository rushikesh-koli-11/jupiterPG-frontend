import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar isOpen={sidebarOpen} />

      <div className="admin-main">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
