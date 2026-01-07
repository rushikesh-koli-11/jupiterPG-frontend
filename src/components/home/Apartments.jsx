import { useEffect, useState } from "react";
import {
  getPgs,
  getRoomsByPg,
  getBedsByRoom
} from "../../api/pgService";
import { sendEnquiry } from "../../api/pgService";
import { useNavigate } from "react-router-dom";
import "./Apartments.css";

export default function Apartments() {
  const [pgs, setPgs] = useState([]);
  const [roomsMap, setRoomsMap] = useState({});
  const [bedsMap, setBedsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [selectedPg, setSelectedPg] = useState(null);
  const [enquiry, setEnquiry] = useState({
    name: "",
    mobile: "",
    message: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pgRes = await getPgs();
      setPgs(pgRes.data || []);

      const rMap = {};
      const bMap = {};

      for (const pg of pgRes.data) {
        const roomRes = await getRoomsByPg(pg.id);
        rMap[pg.id] = roomRes.data;

        for (const room of roomRes.data) {
          const bedRes = await getBedsByRoom(room.id);
          bMap[room.id] = bedRes.data;
        }
      }

      setRoomsMap(rMap);
      setBedsMap(bMap);
    } catch (e) {
      console.error("Failed to load apartments", e);
    } finally {
      setLoading(false);
    }
  };

  const getAvailability = (rooms) => {
    const count = { SINGLE: 0, DOUBLE: 0, TRIPLE: 0 };
    rooms.forEach(r =>
      (bedsMap[r.id] || []).forEach(b => {
        if (b.status === "AVAILABLE") {
          count[b.sharingType]++;
        }
      })
    );
    return count;
  };

  const getMinRent = (rooms) => {
    let min = Infinity;
    rooms.forEach(r =>
      r.sharingTypes?.forEach(s => {
        if (s.rent < min) min = s.rent;
      })
    );
    return min !== Infinity ? min : null;
  };

  if (loading) {
    return (
      <section className="lux-apartments">
        <p className="lux-muted text-center">Loading apartments...</p>
      </section>
    );
  }

  return (
    <section id="apartments" className="lux-apartments">
      <div className="container">

        <div className="lux-header text-center">
          <h2 className="lux-title">Our Apartments</h2>
          <p className="lux-subtitle">
            Premium PGs with flexible sharing options
          </p>
        </div>

        <div className="lux-apartment-list">
          {pgs.map(pg => {
            const rooms = roomsMap[pg.id] || [];
            const availability = getAvailability(rooms);
            const minRent = getMinRent(rooms);

            return (
              <div key={pg.id} className="lux-apartment-card">

                <ImageSlider images={pg.images} />

                <div className="lux-apartment-content">
                  <div className="lux-apartment-header">
                    <h5>{pg.name}</h5>
                    {minRent && (
                      <span className="lux-price-badge">
                        Starts from ₹{minRent}
                      </span>
                    )}
                  </div>

                  <p className="lux-location">{pg.location}</p>

                  <div className="lux-sharing">
                    {Object.entries(availability).map(
                      ([type, count]) =>
                        count > 0 && (
                          <div key={type} className="lux-sharing-card">
                            <strong>{type}</strong>
                            <span>{count} beds</span>
                          </div>
                        )
                    )}
                  </div>

                  <div className="lux-amenities">
                    <Amenity icon="🛜" label="WiFi" />
                    <Amenity icon="🧹" label="Housekeeping" />
                    <Amenity icon="🔐" label="Security" />
                    <Amenity icon="🚿" label="Attached Bath" />
                    <Amenity icon="⚡" label="Power Backup" />
                  </div>

                  <div className="lux-actions">
                    <button
                      className="lux-btn-primary"
                      onClick={() => navigate(`/pg/${pg.id}`)}
                    >
                      View Details
                    </button>

                    <button
                      className="lux-btn-outline"
                      onClick={() => {
                        setSelectedPg(pg);
                        setShowEnquiry(true);
                      }}
                    >
                      Send Enquiry
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showEnquiry && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h3>Enquiry for {selectedPg.name}</h3>

            <form
              className="modal-form"
              onSubmit={async (e) => {
                e.preventDefault();

                await sendEnquiry({
                  pgId: selectedPg.id,
                  name: enquiry.name,
                  mobile: enquiry.mobile,
                  message: enquiry.message
                });

                alert("Enquiry submitted");
                setShowEnquiry(false);
                setEnquiry({ name: "", mobile: "", message: "" });
              }}
            >
              <input
                placeholder="Your Name"
                value={enquiry.name}
                onChange={e =>
                  setEnquiry(p => ({ ...p, name: e.target.value }))
                }
                required
              />

              <input
                placeholder="Mobile Number"
                value={enquiry.mobile}
                onChange={e =>
                  setEnquiry(p => ({ ...p, mobile: e.target.value }))
                }
                required
              />

              <textarea
                placeholder="Message (optional)"
                value={enquiry.message}
                onChange={e =>
                  setEnquiry(p => ({ ...p, message: e.target.value }))
                }
              />

              <div className="modal-footer">
                <button className="btn-primary" type="submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowEnquiry(false)}
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </section>
  );
}

function ImageSlider({ images = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 3000); // ⏱️ slide every 3 seconds

    return () => clearInterval(timer);
  }, [images]);

  if (!images || !images.length) {
    return (
      <div className="lux-apartment-image">
        <img src="/room.jpg" alt="PG" />
      </div>
    );
  }

  return (
    <div className="lux-apartment-image slider">
      <img src={images[index]} alt="PG" />

      {images.length > 1 && (
        <>
          <button
            className="slide-btn left"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((index - 1 + images.length) % images.length);
            }}
          >
            ‹
          </button>

          <button
            className="slide-btn right"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((index + 1) % images.length);
            }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}


function Amenity({ icon, label }) {
  return (
    <div className="lux-amenity">
      <span>{icon}</span>
      <small>{label}</small>
    </div>
  );
}
