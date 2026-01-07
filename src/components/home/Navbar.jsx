import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../../api/axiosConfig";
import { getPgs } from "../../api/pgService";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [search, setSearch] = useState("");

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [pgs, setPgs] = useState([]);

  const [form, setForm] = useState({
    pgId: "",
    name: "",
    mobile: "",
    message: "",
  });

  /* ================= LOAD PGs ================= */
  useEffect(() => {
    getPgs().then((res) => setPgs(res.data || []));
  }, []);

  /* ================= CLOSE MENU ================= */
  const closeMenu = () => {
    setMenuOpen(false);
    setShowMobileSearch(false);
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    closeMenu();
  };

  /* ================= ENQUIRY ================= */
  const submitEnquiry = async (e) => {
    e.preventDefault();

    if (!form.pgId || !form.name || !form.mobile || !form.message) {
      alert("All fields required");
      return;
    }

    try {
      await api.post("/enquiries", form);
      alert("Enquiry submitted");
      setForm({ pgId: "", name: "", mobile: "", message: "" });
      setShowEnquiry(false);
    } catch {
      alert("Failed to submit enquiry");
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav ref={navRef} className="lux-navbar">
        <div className="container nav-inner">

          {/* LOGO */}
          <NavLink to="/" className="lux-logo" onClick={closeMenu}>
            <i className="bi bi-building"></i> Jupiter PG
          </NavLink>

          {/* NAV MENU */}
          <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
            <NavLink to="/apartments" onClick={closeMenu}>Apartments</NavLink>
            <NavLink to="/amenities" onClick={closeMenu}>Amenities</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About Us</NavLink>
            <NavLink to="/faq" onClick={closeMenu}>FAQs</NavLink>

            <button onClick={() => { closeMenu(); setShowEnquiry(true); }}>
              Enquiry
            </button>

            <NavLink to="/contact" className="btn lux-btn-dark" onClick={closeMenu}>
              Contact
            </NavLink>
          </div>

          {/* DESKTOP SEARCH (FULL WIDTH) */}
          <form className="lux-search desktop full-width" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by location, PG name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {/* MOBILE ICONS */}
          <div className="mobile-actions">
            <button className="icon-btn" onClick={() => setShowMobileSearch(true)}>
              <i className="bi bi-search"></i>
            </button>
            <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <i className="bi bi-list"></i>
            </button>
          </div>

        </div>
      </nav>

      {/* ================= MOBILE SEARCH ================= */}
      {showMobileSearch && (
        <div className="mobile-search">
          <form onSubmit={handleSearch}>
            <input
              autoFocus
              placeholder="Search by location, PG name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      )}

      {/* ================= ENQUIRY MODAL ================= */}
      {showEnquiry && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Send Enquiry</h3>

            <form onSubmit={submitEnquiry}>
              <select
                value={form.pgId}
                onChange={(e) => setForm({ ...form, pgId: e.target.value })}
              >
                <option value="">Select PG</option>
                {pgs.map((pg) => (
                  <option key={pg.id} value={pg.id}>{pg.name}</option>
                ))}
              </select>

              <input
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />

              <textarea
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <div className="modal-actions">
                <button className="btn lux-btn-dark">Submit</button>
                <button type="button" onClick={() => setShowEnquiry(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
