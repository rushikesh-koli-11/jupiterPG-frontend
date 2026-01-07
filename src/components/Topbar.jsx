import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Topbar.css";

export default function Topbar({toggleSidebar}) {
  const { user } = useContext(AuthContext);

  return (
    <header className="topbar">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </button>
      <h3 className="topbar-title">
        <i className="bi bi-building-gear"></i> Jupiter PG Admin
      </h3>

      <div className="topbar-user">
        <div className="topbar-notification">
          <i className="bi bi-bell"></i>
        </div>

        <div className="topbar-avatar">
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}
