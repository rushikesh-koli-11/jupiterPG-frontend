import { useEffect, useMemo, useState } from "react";
import { getEnquiries } from "../api/enquiryService";
import { getPgs } from "../api/pgService";
import api from "../api/axiosConfig";
import "./ManageEnquiries.css";

export default function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [pgMap, setPgMap] = useState({});
  const [loading, setLoading] = useState(true);

  /* FILTER */
  const [filterPg, setFilterPg] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const [enqRes, pgRes] = await Promise.all([
        getEnquiries(),
        getPgs(),
      ]);

      setEnquiries(enqRes.data || []);
      setPgs(pgRes.data);

      const map = {};
      pgRes.data.forEach(pg => (map[pg.id] = pg.name));
      setPgMap(map);
    } finally {
      setLoading(false);
    }
  };

  /* STATUS UPDATE */
  const updateStatus = async (id, status) => {
    await api.put(`/enquiries/${id}/status?status=${status}`);
    init();
  };

  /* DELETE */
  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    await api.delete(`/enquiries/${id}`);
    init();
  };

  /* EXPORT */
  const exportCSV = () => {
    const rows = [
      ["Name", "Mobile", "Message", "PG", "Status", "Date"],
      ...filtered.map(e => [
        e.name,
        e.mobile,
        e.message.replace(/,/g, " "),
        pgMap[e.pgId] || "",
        e.status,
        new Date(e.createdAt).toLocaleString(),
      ]),
    ];

    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "enquiries.csv";
    a.click();
  };

  /* FILTERED */
  const filtered = useMemo(() => {
    return enquiries.filter(e => {
      if (filterPg && e.pgId !== filterPg) return false;
      if (filterStatus && e.status !== filterStatus) return false;
      return true;
    });
  }, [enquiries, filterPg, filterStatus]);

  if (loading) {
    return <p className="muted">Loading enquiries...</p>;
  }

  return (
    <div className="enquiries">

      {/* HEADER */}
      <div className="enquiries-top">
        <div>
          <h2>Enquiries</h2>
          <p className="subtitle">Manage and track all customer enquiries</p>
        </div>

        <button className="btn-primary" onClick={exportCSV}>
          <i className="bi bi-download"></i>
          Export CSV
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="enquiries-filter">
        <select value={filterPg} onChange={e => setFilterPg(e.target.value)}>
          <option value="">All PGs</option>
          {pgs.map(pg => (
            <option key={pg.id} value={pg.id}>
              {pg.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="enquiries-table-card">
        <table className="enquiries-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Message</th>
              <th>PG</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="muted">
                  No enquiries found
                </td>
              </tr>
            ) : (
              filtered.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>
                    <a href={`tel:${e.mobile}`} className="phone-link">
                      {e.mobile}
                    </a>
                  </td>
                  <td className="message">{e.message}</td>
                  <td>{pgMap[e.pgId] || "-"}</td>
                  <td>
                    <select
                      className="status-select"
                      value={e.status}
                      onChange={ev =>
                        updateStatus(e.id, ev.target.value)
                      }
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                  <td>{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="actions">
                    <button
                      className="danger"
                      onClick={() => deleteEnquiry(e.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
