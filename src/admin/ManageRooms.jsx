import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import {
  getPgs,
  getRoomsByPg,
  addRoom,
  updateRoom,
  deleteRoom,
} from "../api/pgService";
import "./ManageRooms.css";

export default function ManageRooms() {

  const [pgs, setPgs] = useState([]);
  const [roomsByPg, setRoomsByPg] = useState({});

  const [activePgId, setActivePgId] = useState(null);
  const [editRoomId, setEditRoomId] = useState(null);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const capacityMap = { SINGLE: 1, DOUBLE: 2, TRIPLE: 3 };

  const [form, setForm] = useState({
    floorNumber: "",
    roomNumber: "",
    sharingTypes: [],
  });

  const [bulk, setBulk] = useState({
    floorNumber: "",
    startRoom: "",
    endRoom: "",
  });

  const [sharing, setSharing] = useState({ type: "", rent: "" });
  const [editSharingIndex, setEditSharingIndex] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const pgRes = await getPgs();
    setPgs(pgRes.data);

    const map = {};
    for (const pg of pgRes.data) {
      const roomRes = await getRoomsByPg(pg.id);
      map[pg.id] = roomRes.data;
    }
    setRoomsByPg(map);
  };

  const reloadRooms = async (pgId) => {
    const res = await getRoomsByPg(pgId);
    setRoomsByPg(prev => ({ ...prev, [pgId]: res.data }));
  };

  const saveSharing = () => {
    if (!sharing.type || !sharing.rent) return;

    if (
      form.sharingTypes.some(
        (s, i) => s.type === sharing.type && i !== editSharingIndex
      )
    ) {
      alert("Sharing type already exists");
      return;
    }

    const payload = {
      type: sharing.type,
      rent: Number(sharing.rent),
      capacity: capacityMap[sharing.type],
    };

    const updated = [...form.sharingTypes];
    editSharingIndex !== null
      ? (updated[editSharingIndex] = payload)
      : updated.push(payload);

    setForm({ ...form, sharingTypes: updated });
    resetSharing();
  };

  const editSharing = (index) => {
    const s = form.sharingTypes[index];
    setSharing({ type: s.type, rent: s.rent });
    setEditSharingIndex(index);
  };

  const deleteSharing = (index) => {
    setForm({
      ...form,
      sharingTypes: form.sharingTypes.filter((_, i) => i !== index),
    });
    resetSharing();
  };

  const resetSharing = () => {
    setSharing({ type: "", rent: "" });
    setEditSharingIndex(null);
  };

  const closeRoomModal = () => {
    setShowRoomModal(false);
    setEditRoomId(null);
    setActivePgId(null);
    setForm({ floorNumber: "", roomNumber: "", sharingTypes: [] });
    resetSharing();
  };

  const closeBulkModal = () => {
    setShowBulkModal(false);
    setActivePgId(null);
    setBulk({ floorNumber: "", startRoom: "", endRoom: "" });
    setForm({ ...form, sharingTypes: [] });
    resetSharing();
  };

  const openAddRoom = (pgId) => {
    setActivePgId(pgId);
    setEditRoomId(null);
    setForm({ floorNumber: "", roomNumber: "", sharingTypes: [] });
    resetSharing();
    setShowRoomModal(true);
  };

  const openEditRoom = (pgId, room) => {
    setActivePgId(pgId);
    setEditRoomId(room.id);
    setForm({
      floorNumber: room.floorNumber,
      roomNumber: room.roomNumber,
      sharingTypes: room.sharingTypes || [],
    });
    resetSharing();
    setShowRoomModal(true);
  };

  const submitRoom = async (e) => {
    e.preventDefault();

    const payload = {
      pgId: activePgId,
      floorNumber: Number(form.floorNumber),
      roomNumber: form.roomNumber,
      sharingTypes: form.sharingTypes,
    };

    try {
      editRoomId
        ? await updateRoom(editRoomId, payload)
        : await addRoom(payload);

      closeRoomModal();
      reloadRooms(activePgId);

    } catch (err) {
      alert(err.response?.data?.error || "Unable to save room");
    }
  };

  const openBulkModal = (pgId) => {
    setActivePgId(pgId);
    setBulk({ floorNumber: "", startRoom: "", endRoom: "" });
    setForm({ ...form, sharingTypes: [] });
    resetSharing();
    setShowBulkModal(true);
  };

  const submitBulk = async (e) => {
    e.preventDefault();

    try {
      await api.post("/rooms/bulk", {
        pgId: activePgId,
        floorNumber: Number(bulk.floorNumber),
        startRoom: Number(bulk.startRoom),
        endRoom: Number(bulk.endRoom),
        sharingTypes: form.sharingTypes,
      });

      closeBulkModal();
      reloadRooms(activePgId);

    } catch (err) {
      alert(err.response?.data?.error || "Bulk room creation failed");
    }
  };

  const removeRoom = async (pgId, roomId) => {
    if (window.confirm("Delete room?")) {
      await deleteRoom(roomId);
      reloadRooms(pgId);
    }
  };

  return (
    <div className="rooms-page">
      <h2 className="rooms-title">Manage Rooms</h2>

      {pgs.map(pg => {
        const rooms = roomsByPg[pg.id] || [];

        // Group rooms by floor
        const floors = rooms.reduce((acc, r) => {
          acc[r.floorNumber] = acc[r.floorNumber] || [];
          acc[r.floorNumber].push(r);
          return acc;
        }, {});

        return (
          <div key={pg.id} className="room-card">

            {/* PG HEADER */}
            <details className="pg-accordion">
              <summary className="pg-summary">
                <span>{pg.name}</span>

                <div className="room-actions">
                  <button
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddRoom(pg.id);
                    }}
                  >
                    ➕ Add Room
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openBulkModal(pg.id);
                    }}
                  >
                    ⚡ Bulk Add
                  </button>
                </div>
              </summary>

              {/* FLOORS */}
              {Object.keys(floors).length === 0 ? (
                <p className="muted">No rooms added</p>
              ) : (
                Object.entries(floors).map(([floor, floorRooms]) => (
                  <details key={floor} className="floor-accordion">
                    <summary className="floor-summary">
                      Floor {floor}
                    </summary>

                    {/* ROOMS TABLE */}
                    <table className="rooms-table">
                      <thead>
                        <tr>
                          <th>Room</th>
                          <th>Sharing</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {floorRooms.map(room => (
                          <tr key={room.id}>
                            <td>{room.roomNumber}</td>

                            <td>
                              {room.sharingTypes.map(s => (
                                <div key={s.type}>
                                  {s.type} – ₹{s.rent}
                                </div>
                              ))}
                            </td>

                            <td className="table-actions">
                              <button
                                type="button"
                                className="icon-btn edit"
                                onClick={() => openEditRoom(pg.id, room)}
                              >
                                ✏️
                              </button>

                              <button
                                type="button"
                                className="icon-btn delete"
                                onClick={() => removeRoom(pg.id, room.id)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </details>
                ))
              )}
            </details>
          </div>
        );
      })}

      {showRoomModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{editRoomId ? "Edit Room" : "Add Room"}</h3>

            <form onSubmit={submitRoom} className="modal-form">
              <input required placeholder="Floor Number"
                value={form.floorNumber}
                onChange={e => setForm({ ...form, floorNumber: e.target.value })} />

              <input required placeholder="Room Number"
                value={form.roomNumber}
                onChange={e => setForm({ ...form, roomNumber: e.target.value })} />

              <hr />

              <h4>Sharing Types</h4>

              <select
                value={sharing.type}
                onChange={e => setSharing({ ...sharing, type: e.target.value })}
              >
                <option value="">Select Type</option>
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="TRIPLE">Triple</option>
              </select>

              <input type="number" placeholder="Rent per Bed"
                value={sharing.rent}
                onChange={e => setSharing({ ...sharing, rent: e.target.value })} />

              <button type="button" className="btn-secondary" onClick={saveSharing}>
                {editSharingIndex !== null ? "Update" : "Add"} Sharing
              </button>

              <ul className="sharing-list">
                {form.sharingTypes.map((s, i) => (
                  <li key={i}>
                    {s.type} – {capacityMap[s.type]} Beds – ₹{s.rent}
                    <span>
                      <button type="button" onClick={() => editSharing(i)}>Edit</button>
                      <button type="button" onClick={() => deleteSharing(i)}>Delete</button>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="modal-footer">
                <button className="btn-primary" type="submit">
                  {editRoomId ? "Update Room" : "Save Room"}
                </button>
                <button type="button" className="btn-ghost" onClick={closeRoomModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Bulk Add Rooms</h3>

            <form onSubmit={submitBulk} className="modal-form">
              <input required placeholder="Floor Number"
                value={bulk.floorNumber}
                onChange={e => setBulk({ ...bulk, floorNumber: e.target.value })} />

              <input required placeholder="Start Room No"
                value={bulk.startRoom}
                onChange={e => setBulk({ ...bulk, startRoom: e.target.value })} />

              <input required placeholder="End Room No"
                value={bulk.endRoom}
                onChange={e => setBulk({ ...bulk, endRoom: e.target.value })} />

              <hr />

              <h4>Sharing Types</h4>

              <select
                value={sharing.type}
                onChange={e => setSharing({ ...sharing, type: e.target.value })}
              >
                <option value="">Select Type</option>
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="TRIPLE">Triple</option>
              </select>

              <input type="number" placeholder="Rent per Bed"
                value={sharing.rent}
                onChange={e => setSharing({ ...sharing, rent: e.target.value })} />

              <button type="button" className="btn-secondary " onClick={saveSharing}>
                Add Sharing
              </button>

              <ul className="sharing-list">
                {form.sharingTypes.map((s, i) => (
                  <li key={i}>
                    {s.type} – {capacityMap[s.type]} Beds – ₹{s.rent}
                  </li>
                ))}
              </ul>

              <div className="modal-footer">
                <button className="btn-primary" type="submit">
                  Create Rooms
                </button>
                <button type="button" className="btn-ghost" onClick={closeBulkModal}>
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
