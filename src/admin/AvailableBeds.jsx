import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";
import { getPgs, getRoomsByPg } from "../api/pgService";
import "./AvailableBeds.css";

export default function AvailableBeds() {
  const [pgs, setPgs] = useState([]);
  const [beds, setBeds] = useState([]);

  const [pgMap, setPgMap] = useState({});
  const [roomMap, setRoomMap] = useState({});

  
  const [filters, setFilters] = useState({
    pgId: "",
    floor: "",
    roomId: "",
    bed: "",
    sharing: "",
  });

  const [filterRooms, setFilterRooms] = useState([]);


  const [showModal, setShowModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  const [form, setForm] = useState({
    pgId: "",
    roomId: "",
    bedId: "",
    name: "",
    mobile: "",
    email: "",
    rent: "",
    deposit: "",
    checkInDate: "",
    expectedCheckOutDate: "",
  });

 
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await Promise.all([loadPgsAndRooms(), loadAvailableBeds()]);
  };

  const loadAvailableBeds = async () => {
    const res = await api.get("/beds");
    setBeds(res.data.filter(b => b.status === "AVAILABLE"));
  };

  const loadPgsAndRooms = async () => {
    const pgRes = await getPgs();
    setPgs(pgRes.data);

    const pgNameMap = {};
    const roomInfoMap = {};

    for (const pg of pgRes.data) {
      pgNameMap[pg.id] = pg.name;

      const roomRes = await getRoomsByPg(pg.id);
      roomRes.data.forEach(room => {
        roomInfoMap[room.id] = {
          pgId: pg.id,
          roomNumber: room.roomNumber,
          floorNumber: room.floorNumber,
        };
      });
    }

    setPgMap(pgNameMap);
    setRoomMap(roomInfoMap);
  };

 
  useEffect(() => {
    if (!filters.pgId) {
      setFilterRooms([]);
      setFilters(f => ({ ...f, roomId: "" }));
      return;
    }

    let roomsForPg = Object.entries(roomMap)
      .filter(([_, r]) => r.pgId === filters.pgId)
      .map(([id, r]) => ({ id, ...r }));

    if (filters.floor) {
      roomsForPg = roomsForPg.filter(
        r => r.floorNumber === Number(filters.floor)
      );
    }

    setFilterRooms(roomsForPg);
  }, [filters.pgId, filters.floor, roomMap]);

 
  const filteredBeds = useMemo(() => {
    return beds.filter(b => {
      const room = roomMap[b.roomId];
      if (!room) return false;

      if (filters.pgId && room.pgId !== filters.pgId) return false;
      if (filters.floor && room.floorNumber !== Number(filters.floor)) return false;
      if (filters.roomId && b.roomId !== filters.roomId) return false;
      if (filters.bed && !b.bedNumber.toLowerCase().includes(filters.bed.toLowerCase())) return false;
      if (filters.sharing && b.sharingType !== filters.sharing) return false;

      return true;
    });
  }, [beds, filters, roomMap]);


  const openAddResidentModal = (bed) => {
    const room = roomMap[bed.roomId];
    if (!room) return;

    setSelectedBed(bed);
    setForm({
      pgId: room.pgId,
      roomId: bed.roomId,
      bedId: bed.id,
      name: "",
      mobile: "",
      email: "",
      rent: "",
      deposit: "",
      checkInDate: "",
      expectedCheckOutDate: "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBed(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.mobile || !form.rent || !form.deposit || !form.checkInDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await api.post("/residents", form);
      closeModal();
      loadAvailableBeds();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add resident");
    }
  };

  return (
    <div className="beds">

     
      <div className="beds-top">
        <h2>Available Beds</h2>
        <p className="subtitle">Assign residents to vacant beds</p>
      </div>

   
      <div className="beds-filter">
        <select
          value={filters.pgId}
          onChange={e =>
            setFilters({
              pgId: e.target.value,
              floor: "",
              roomId: "",
              bed: "",
              sharing: filters.sharing,
            })
          }
        >
          <option value="">All Buildings</option>
          {pgs.map(pg => (
            <option key={pg.id} value={pg.id}>{pg.name}</option>
          ))}
        </select>

        <select
          value={filters.floor}
          onChange={e =>
            setFilters(f => ({
              ...f,
              floor: e.target.value,
              roomId: "",
            }))
          }
        >
          <option value="">All Floors</option>
          {[1,2,3,4,5,6,7,8].map(f => (
            <option key={f} value={f}>Floor {f}</option>
          ))}
        </select>

        <select
          value={filters.roomId}
          onChange={e => setFilters(f => ({ ...f, roomId: e.target.value }))}
          disabled={!filters.pgId}
        >
          <option value="">All Rooms</option>
          {filterRooms.map(r => (
            <option key={r.id} value={r.id}>
              Room {r.roomNumber}
            </option>
          ))}
        </select>

        <input
          placeholder="Bed No"
          value={filters.bed}
          onChange={e => setFilters(f => ({ ...f, bed: e.target.value }))}
        />

        <select
          value={filters.sharing}
          onChange={e => setFilters(f => ({ ...f, sharing: e.target.value }))}
        >
          <option value="">All Sharing</option>
          <option value="SINGLE">Single</option>
          <option value="DOUBLE">Double</option>
          <option value="TRIPLE">Triple</option>
        </select>
      </div>

   
      <div className="beds-table-card">
        <table className="beds-table">
          <thead>
            <tr>
              <th>Building</th>
              <th>Floor</th>
              <th>Room</th>
              <th>Bed</th>
              <th>Sharing</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredBeds.map(bed => {
              const room = roomMap[bed.roomId];
              return (
                <tr key={bed.id}>
                  <td>{pgMap[room?.pgId]}</td>
                  <td>{room?.floorNumber}</td>
                  <td>{room?.roomNumber}</td>
                  <td>{bed.bedNumber}</td>
                  <td>{bed.sharingType}</td>
                  <td className="actions">
                    <button className="btn-primary" onClick={() => openAddResidentModal(bed)}>
                      Add Resident
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

     
      {showModal && selectedBed && (
        <div className="modal-overlay">
          <div className="modal-card">

            <div className="modal-header">
              <h3>Add Resident</h3>
              <button onClick={closeModal}>✕</button>
            </div>

            <div className="location-box">
              <div><strong>Building:</strong> {pgMap[form.pgId]}</div>
              <div>
                <strong>Room:</strong> {roomMap[form.roomId]?.roomNumber}
                {" "} (Floor {roomMap[form.roomId]?.floorNumber})
              </div>
              <div><strong>Bed:</strong> {selectedBed.bedNumber}</div>
            </div>

            <form onSubmit={submit} className="modal-body">
              <input placeholder="Name" required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />

              <input placeholder="Mobile" required
                value={form.mobile}
                onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} />

              <input placeholder="Email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />

              <input type="number" placeholder="Monthly Rent" required
                value={form.rent}
                onChange={e => setForm(p => ({ ...p, rent: e.target.value }))} />

              <input type="number" placeholder="Deposit Amount" required
                value={form.deposit}
                onChange={e => setForm(p => ({ ...p, deposit: e.target.value }))} />

              <input type="date" required
                value={form.checkInDate}
                onChange={e => setForm(p => ({ ...p, checkInDate: e.target.value }))} />

              <input type="date"
                value={form.expectedCheckOutDate}
                onChange={e => setForm(p => ({ ...p, expectedCheckOutDate: e.target.value }))} />

              <div className="modal-footer">
                <button className="btn-primary" type="submit">Add Resident</button>
                <button type="button" className="btn-ghost" onClick={closeModal}>Cancel</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
