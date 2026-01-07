import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPgs,
  getRoomsByPg,
  getBedsByRoom,
  sendEnquiry
} from "../api/pgService";
import "./PgDetails.css";

export default function PgDetails() {
  const { id } = useParams();

  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bedsMap, setBedsMap] = useState({});
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquiry, setEnquiry] = useState({
    name: "",
    mobile: "",
    message: ""
  });

  useEffect(() => {
    load();
  }, [id]);

  /* ================= LOAD DATA ================= */

  const load = async () => {
    try {
      setLoading(true);

      const pgRes = await getPgs();
      const found = pgRes.data.find(p => String(p.id) === String(id));
      if (!found) return;

      setPg(found);

      const roomRes = await getRoomsByPg(id);
      setRooms(roomRes.data || []);

      const bMap = {};
      for (const r of roomRes.data || []) {
        const bedRes = await getBedsByRoom(r.id);
        bMap[r.id] = bedRes.data || [];
      }
      setBedsMap(bMap);

    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const availabilityByRoom = (room) => {
    const beds = bedsMap[room.id] || [];
    const map = {};
    beds.forEach(b => {
      if (b.status === "AVAILABLE") {
        map[b.sharingType] = (map[b.sharingType] || 0) + 1;
      }
    });
    return map;
  };

  const minRent = (() => {
    const rents = [];
    rooms.forEach(r =>
      r.sharingTypes?.forEach(s => rents.push(s.rent))
    );
    return rents.length ? Math.min(...rents) : null;
  })();

  /* ================= AUTO IMAGE SLIDE ================= */

  useEffect(() => {
    if (!pg?.images?.length) return;

    const t = setInterval(() => {
      setActiveImage(i => (i + 1) % pg.images.length);
    }, 3500);

    return () => clearInterval(t);
  }, [pg]);

  if (loading) {
    return (
      <div className="pg-detail-page center">
        Loading PG details...
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="pg-detail-page center">
        PG not found
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <section className="pg-detail-page">

      {/* IMAGE CAROUSEL */}
      <div className="pg-carousel">
        <img
          src={pg.images?.[activeImage] || "/room.jpg"}
          alt={pg.name}
        />
      </div>

      <div className="pg-detail-container">

        {/* HEADER */}
        <div className="pg-header">
          <div>
            <h1>{pg.name}</h1>
            <p className="pg-location">{pg.location}</p>
          </div>

          {/* PRICE + INLINE ENQUIRY */}
          {minRent && (
            <div className="price-enquiry">
              <span className="pg-badge">
                Starts from ₹{minRent}
              </span>
              <button
                className="lux-btn-primary"
                onClick={() => setShowEnquiry(true)}
              >
                Send Enquiry
              </button>
            </div>
          )}
        </div>

        {/* TRUST BADGES */}
        <div className="trust-badges">
          <span>✔ Verified</span>
          <span>🏢 Managed</span>
          <span>🔐 Secure</span>
        </div>

        {/* ROOMS */}
        <h3 className="section-title">Room Availability</h3>

        <div className="room-list">
          {rooms.map(room => {
            const availability = availabilityByRoom(room);

            return (
              <div key={room.id} className="room-card">
                <h4>
                  Room {room.roomNumber} · Floor {room.floorNumber}
                </h4>

                <div className="room-sharing">
                  {room.sharingTypes.map(s => (
                    <div key={s.type} className="sharing-box">
                      <strong>{s.type}</strong>
                      <span>₹{s.rent}</span>
                      <small>
                        {availability[s.type] ?? 0} beds available
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

     
      {showEnquiry && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Enquiry for {pg.name}</h3>

            <form
              className="modal-form"
              onSubmit={async (e) => {
                e.preventDefault();

                await sendEnquiry({
                  pgId: pg.id,
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
                <button className="lux-btn-primary" type="submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="lux-btn-outline"
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
