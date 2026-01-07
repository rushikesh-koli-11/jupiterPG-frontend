import { useEffect, useMemo, useState } from "react";
import {
  getPgs,
  getRoomsByPg,
  getBedsByRoom,
  getResidents,
  addResident,
} from "../api/pgService";
import api from "../api/axiosConfig";
import "./ManageResidents.css";

export default function ManageResidents() {
  const [pgs, setPgs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [residents, setResidents] = useState([]);

  const [idProof, setIdProof] = useState(null);
  const [idPreview, setIdPreview] = useState(null);

  const [pgMap, setPgMap] = useState({});
  const [roomMap, setRoomMap] = useState({});
  const [bedMap, setBedMap] = useState({});

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ================= FILTER STATE ================= */

  const [filters, setFilters] = useState({
    pgId: "",
    roomId: "",
    bedId: "",
    status: "",
    search: "",
  });

  const [filterRooms, setFilterRooms] = useState([]);
  const [filterBeds, setFilterBeds] = useState([]);

  /* ================= FORM ================= */

  const [form, setForm] = useState({
    pgId: "",
    roomId: "",
    floorNumber: "",
    bedId: "",
    name: "",
    mobile: "",
    email: "",
    rent: "",
    deposit: "",
    checkInDate: "",
    expectedCheckOutDate: "",
  });

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await Promise.all([
      loadPgs(),
      loadRoomMap(),
      loadResidents(),
      loadBedMap(),
    ]);
  };

  const loadPgs = async () => {
    const res = await getPgs();
    setPgs(res.data);
    const map = {};
    res.data.forEach(pg => (map[pg.id] = pg.name));
    setPgMap(map);
  };

  const loadRoomMap = async () => {
    const pgRes = await getPgs();
    const map = {};
    for (const pg of pgRes.data) {
      const roomRes = await getRoomsByPg(pg.id);
      roomRes.data.forEach(r => {
        map[r.id] = {
          pgId: pg.id,
          roomNumber: r.roomNumber,
          floorNumber: r.floorNumber,
        };
      });
    }
    setRoomMap(map);
  };

  const loadResidents = async () => {
    const res = await getResidents();
    setResidents(res.data);
  };

  const loadBedMap = async () => {
    const res = await api.get("/beds");
    const map = {};
    res.data.forEach(b => (map[b.id] = b));
    setBedMap(map);
  };

  /* ================= FILTER DEPENDENCY ================= */

  useEffect(() => {
    if (!filters.pgId) {
      setFilterRooms([]);
      setFilterBeds([]);
      setFilters(f => ({ ...f, roomId: "", bedId: "" }));
      return;
    }

    const roomsForPg = Object.entries(roomMap)
      .filter(([_, r]) => r.pgId === filters.pgId)
      .map(([id, r]) => ({ id, ...r }));

    setFilterRooms(roomsForPg);
    setFilterBeds([]);
  }, [filters.pgId, roomMap]);

  useEffect(() => {
    if (!filters.roomId) {
      setFilterBeds([]);
      setFilters(f => ({ ...f, bedId: "" }));
      return;
    }

    const bedsForRoom = Object.values(bedMap)
      .filter(b => b.roomId === filters.roomId);

    setFilterBeds(bedsForRoom);
  }, [filters.roomId, bedMap]);

  /* ================= FORM DROPDOWNS ================= */

  const onBuildingChange = async (pgId) => {
    const res = await getRoomsByPg(pgId);
    setRooms(res.data);
    setBeds([]);

    setForm(p => ({
      ...p,
      pgId,
      roomId: "",
      bedId: "",
      floorNumber: "",
    }));
  };

  const onRoomChange = async (roomId) => {
    const room = roomMap[roomId];
    if (!room) return;

    const res = await getBedsByRoom(roomId);

    setBeds(
      res.data.filter(
        b => b.status === "AVAILABLE" || b.id === form.bedId
      )
    );

    setForm(p => ({
      ...p,
      roomId,
      floorNumber: room.floorNumber,
      bedId: "",
    }));
  };

  /* ================= ADD / EDIT ================= */

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "resident",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );

    if (idProof) {
      formData.append("idProof", idProof);
    }

    if (editId) {
      await api.put(`/residents/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } else {
      await api.post("/residents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    closeModal();
    loadResidents();
  };


  const openAddModal = () => {
    reset();
    setShowModal(true);
  };

  /* ========= EDIT ========= */

  const openEditModal = async (r) => {
    setEditId(r.id);

    const roomRes = await getRoomsByPg(r.pgId);
    setRooms(roomRes.data);

    const bedRes = await getBedsByRoom(r.roomId);
    setBeds(
      bedRes.data.filter(
        b => b.status === "AVAILABLE" || b.id === r.bedId
      )
    );

    setForm({
      pgId: r.pgId,
      roomId: r.roomId,
      floorNumber: r.floorNumber,
      bedId: r.bedId,
      name: r.name,
      mobile: r.mobile,
      email: r.email,
      rent: r.rent,
      deposit: r.deposit || "",
      checkInDate: r.checkInDate,
      expectedCheckOutDate: r.expectedCheckOutDate || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  const reset = () => {
    setEditId(null);
    setForm({
      pgId: "",
      roomId: "",
      floorNumber: "",
      bedId: "",
      name: "",
      mobile: "",
      email: "",
      rent: "",
      deposit: "",
      checkInDate: "",
      expectedCheckOutDate: "",
    });
    setRooms([]);
    setBeds([]);
  };

  /* ================= CHECKOUT & DELETE ================= */

  const checkoutResident = async (id) => {
    if (window.confirm("Checkout resident?")) {
      await api.put(`/residents/${id}/checkout`);
      loadResidents();
      loadBedMap();
    }
  };

  const deleteResident = async (id) => {
    if (window.confirm("Delete resident permanently?")) {
      await api.delete(`/residents/${id}`);
      loadResidents();
      loadBedMap();
    }
  };

  /* ================= FILTERED DATA ================= */

  const filteredResidents = useMemo(() => {
    return residents.filter(r => {
      if (filters.pgId && r.pgId !== filters.pgId) return false;
      if (filters.roomId && r.roomId !== filters.roomId) return false;
      if (filters.bedId && r.bedId !== filters.bedId) return false;
      if (filters.status && r.status !== filters.status) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const room = roomMap[r.roomId];
        const bed = bedMap[r.bedId];

        if (
          !r.name.toLowerCase().includes(q) &&
          !r.mobile.toLowerCase().includes(q) &&
          !room?.roomNumber?.toLowerCase().includes(q) &&
          !bed?.bedNumber?.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [residents, filters, roomMap, bedMap]);

  /* ================= UI ================= */

  return (
    <div className="residents-page">
      <h2 className="residents-title">Manage Residents</h2>

      {/* FILTER BAR */}
      <div className="filter-card">
        <select value={filters.pgId}
          onChange={e => setFilters(f => ({ ...f, pgId: e.target.value }))}>
          <option value="">All Buildings</option>
          {pgs.map(pg => (
            <option key={pg.id} value={pg.id}>{pg.name}</option>
          ))}
        </select>

        <select value={filters.roomId}
          onChange={e => setFilters(f => ({ ...f, roomId: e.target.value }))}>
          <option value="">All Rooms</option>
          {filterRooms.map(r => (
            <option key={r.id} value={r.id}>
              Room {r.roomNumber} (Floor {r.floorNumber})
            </option>
          ))}
        </select>

        <select value={filters.bedId}
          onChange={e => setFilters(f => ({ ...f, bedId: e.target.value }))}>
          <option value="">All Beds</option>
          {filterBeds.map(b => (
            <option key={b.id} value={b.id}>{b.bedNumber}</option>
          ))}
        </select>

        <select value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="CHECKED_OUT">CHECKED_OUT</option>
        </select>

        <input
          placeholder="Search name / mobile / room / bed"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
      </div>

      <button className="btn-primary" onClick={openAddModal}>
        ➕ Add Resident
      </button>

      {/* TABLE */}
      <table className="residents-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Room</th>
            <th>Bed</th>
            <th>Rent</th>
            <th>Deposit</th>
            <th>Status</th>
            <th>ID Proof</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredResidents.map(r => {
            const room = roomMap[r.roomId];
            const bed = bedMap[r.bedId];
            return (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.mobile}</td>
                <td>{room?.roomNumber}</td>
                <td>{bed?.bedNumber}</td>
                <td>₹{r.rent}</td>
                <td>₹{r.deposit}</td>
                <td>{r.status}</td>
                <td>
                  {r.idProofUrl && (
                    <a href={r.idProofUrl} target="_blank" rel="noreferrer" className="idproof-link">
                      View
                    </a>
                  )}
                </td>

                <td className="table-actions">
                  <button
                    disabled={r.status === "CHECKED_OUT"}
                    title={r.status === "CHECKED_OUT" ? "Cannot edit checked-out resident" : ""}
                    onClick={() => openEditModal(r)}
                  >
                    Edit
                  </button>

                  <button
                    disabled={r.status === "CHECKED_OUT"}
                    title={r.status === "CHECKED_OUT" ? "Resident already checked out" : ""}
                    onClick={() => checkoutResident(r.id)}
                  >
                    Checkout
                  </button>

                  <button
                    disabled={r.status === "ACTIVE"}
                    title={r.status === "ACTIVE" ? "Delete allowed only after checkout" : ""}
                    onClick={() => deleteResident(r.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card modal-scroll">

            <h3>{editId ? "Edit Resident" : "Add Resident"}</h3>

            <form onSubmit={submit} className="modal-form">

              <select value={form.pgId}
                onChange={e => onBuildingChange(e.target.value)} required>
                <option value="">Select Building</option>
                {pgs.map(pg => (
                  <option key={pg.id} value={pg.id}>{pg.name}</option>
                ))}
              </select>

              <select value={form.roomId}
                onChange={e => onRoomChange(e.target.value)}
                disabled={!rooms.length} required>
                <option value="">Select Room</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    Room {r.roomNumber} (Floor {r.floorNumber})
                  </option>
                ))}
              </select>

              <select value={form.bedId}
                onChange={e => setForm(p => ({ ...p, bedId: e.target.value }))}
                disabled={!beds.length} required>
                <option value="">Select Bed</option>
                {beds.map(b => (
                  <option key={b.id} value={b.id}>{b.bedNumber}</option>
                ))}
              </select>

              <input placeholder="Name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />

              <input placeholder="Mobile"
                value={form.mobile}
                onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} required />

              <input placeholder="Email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />

              <input type="number" placeholder="Monthly Rent"
                value={form.rent}
                onChange={e => setForm(p => ({ ...p, rent: e.target.value }))} required />

              <input type="number" placeholder="Deposit"
                value={form.deposit}
                onChange={e => setForm(p => ({ ...p, deposit: e.target.value }))} required />

              {/* ✅ LABEL + INPUT */}
              <label className="form-label">Check-in Date</label>
              <input type="date"
                value={form.checkInDate}
                onChange={e => setForm(p => ({ ...p, checkInDate: e.target.value }))} required />

              {/* ✅ LABEL + INPUT */}
              <label className="form-label">Expected Check-out Date</label>
              <input type="date"
                value={form.expectedCheckOutDate}
                onChange={e => setForm(p => ({ ...p, expectedCheckOutDate: e.target.value }))} />

              <label className="form-label">ID Proof and ID Size Photo</label>

              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  setIdProof(file);
                  setIdPreview(URL.createObjectURL(file));
                }}
              />

              {idPreview && (
                <div className="id-proof-wrapper">
                  <img
                    src={idPreview}
                    alt="ID Proof Preview"
                    className="id-proof-preview"
                  />
                </div>
              )}


              <div className="modal-footer">
                <button className="btn-primary" type="submit">
                  {editId ? "Update Resident" : "Add Resident"}
                </button>
                <button type="button" className="btn-ghost" onClick={closeModal}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
