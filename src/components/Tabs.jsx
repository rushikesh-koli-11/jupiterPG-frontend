export default function Tabs({ active, setActive }) {
  return (
    <div className="tabs">
      {["Add Room", "Manage Rooms", "Manage Beds"].map((tab) => (
        <button
          key={tab}
          className={active === tab ? "active" : ""}
          onClick={() => setActive(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
