import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./admin/Dashboard";
import ManageRooms from "./admin/ManageRooms";
import ManageResidents from "./admin/ManageResidents";
import ManageBuildings from "./admin/ManageBuildings";
import ManageEnquiries from "./admin/ManageEnquiries";
import AvailableBeds from "./admin/AvailableBeds";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import ApartmentsPage from "./pages/ApartmentsPage";
import AmenitiesPage from "./pages/AmenitiesPage";
import FAQPage from "./pages/FAQPage";
import Search from "./pages/Search";
import PgDetails from "./pages/PgDetails";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* 🌐 PUBLIC PAGES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/search" element={<Search />} />

          <Route path="/apartments" element={<ApartmentsPage />} />
          <Route path="/amenities" element={<AmenitiesPage />} />
          <Route path="/faq" element={<FAQPage />} />
           <Route path="/pg/:id" element={<PgDetails />} />
        </Route>

        {/* 🔐 ADMIN PAGES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="residents" element={<ManageResidents />} />
          <Route path="buildings" element={<ManageBuildings />} />
          <Route path="enquiries" element={<ManageEnquiries />} />
          <Route path="available-beds" element={<AvailableBeds />} />
        </Route>

        {/* ❌ 404 FALLBACK */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
