import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar({ isOpen }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div>
        <div className="sidebar-header">
          <h2 className="logo">
            <i className="bi bi-building"></i>
            {isOpen && <span>Jupiter Admin</span>}
          </h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard">
            <i className="bi bi-speedometer2"></i>
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/admin/buildings">
            <i className="bi bi-buildings"></i>
            {isOpen && <span>Manage Buildings</span>}
          </NavLink>

          <NavLink to="/admin/rooms">
            <i className="bi bi-door-closed"></i>
            {isOpen && <span>Manage Rooms</span>}
          </NavLink>

          <NavLink to="/admin/residents">
            <i className="bi bi-people"></i>
            {isOpen && <span>Manage Residents</span>}
          </NavLink>

          <NavLink to="/admin/available-beds">
            <i className="bi bi-layout-text-window"></i>
            {isOpen && <span>Available Beds</span>}
          </NavLink>

          <NavLink to="/admin/enquiries">
            <i className="bi bi-chat-left-text"></i>
            {isOpen && <span>Enquiries</span>}
          </NavLink>
        </nav>
      </div>

      <button className="sidebar-logout" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i>
        {isOpen && <span>Logout</span>}
      </button>
    </aside>
  );
}
