import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/pgService";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getDashboardStats();
    setStats(res.data);
  };

  if (!stats) {
    return <p className="dashboard-loading">Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
    
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Quick snapshot of your PG operations</p>
      </div>

     
      <div className="dashboard-grid">
        <DashboardCard
          icon="bi-buildings"
          title="PGs"
          value={stats.totalPgs}
        />
        <DashboardCard
          icon="bi-door-closed"
          title="Rooms"
          value={stats.totalRooms}
        />
        <DashboardCard
          icon="bi-grid-3x3-gap"
          title="Beds"
          value={stats.totalBeds}
        />
        <DashboardCard
          icon="bi-person-check"
          title="Occupied Beds"
          value={stats.occupiedBeds}
        />
        <DashboardCard
          icon="bi-person-plus"
          title="Available Beds"
          value={stats.availableBeds}
        />
        <DashboardCard
          icon="bi-chat-left-text"
          title="Enquiries"
          value={stats.totalEnquiries ?? 0}
        />
      </div>

      
      <div className="dashboard-section">
        <h3>Revenue Summary</h3>

        <div className="dashboard-grid">
          <DashboardCard
            icon="bi-currency-rupee"
            title="This Month"
            value={`₹${stats.monthlyRevenue ?? 0}`}
          />
          <DashboardCard
            icon="bi-calendar3"
            title="This Year"
            value={`₹${stats.yearlyRevenue ?? 0}`}
          />
          <DashboardCard
            icon="bi-graph-up-arrow"
            title="Total Revenue"
            value={`₹${stats.totalRevenue}`}
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, value }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-icon">
        <i className={`bi ${icon}`}></i>
      </div>

      <div className="dashboard-card-info">
        <span className="title">{title}</span>
        <span className="value">{value}</span>
      </div>
    </div>
  );
}
