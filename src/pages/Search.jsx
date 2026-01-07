import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPgs } from "../api/pgService";
import "./Search.css";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [query]);

  const loadResults = async () => {
    try {
      const res = await getPgs();
      const filtered = res.data.filter(
        (pg) =>
          pg.name.toLowerCase().includes(query.toLowerCase()) ||
          (pg.address || "").toLowerCase().includes(query.toLowerCase())
      );
      setPgs(filtered);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="lux-search-page">
      <div className="container">

     
        <div className="lux-header text-center">
          <h2 className="lux-title">Search Results</h2>
          <p className="lux-subtitle">
            Showing results for <strong>{query}</strong>
          </p>
        </div>

        {loading ? (
          <p className="lux-muted text-center">Searching apartments...</p>
        ) : !pgs.length ? (
          <p className="lux-muted text-center">No matching apartments found</p>
        ) : (
          <div className="lux-apartment-list">
            {pgs.map((pg) => (
              <div key={pg.id} className="lux-apartment-card">

              
                <div className="lux-apartment-image">
                  <img
                    src={pg.imageUrl || "/room.jpg"}
                    alt={pg.name}
                  />
                  <span className="lux-badge lux-badge-verified">
                    ✓ Partner Verified
                  </span>
                </div>

             
                <div className="lux-apartment-content">
                  <div className="lux-apartment-header">
                    <h5>{pg.name}</h5>
                    <span className="lux-price">
                      ₹{pg.price || "11,000"} <small>onwards</small>
                    </span>
                  </div>

                  <p className="lux-location">
                    {pg.address || "Pune, Maharashtra"}
                  </p>

                  <div className="lux-room-types">
                    <span>Single Room</span>
                    <span>Twin Sharing</span>
                  </div>

                  <p className="lux-desc">
                    Professionally managed premium PG with modern amenities,
                    security, and comfort-focused living.
                  </p>

                  <div className="lux-actions">
                    <button className="lux-btn-primary">View Phone No.</button>
                    <button className="lux-btn-outline">Contact Owner</button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
