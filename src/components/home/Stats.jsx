import { useEffect, useState } from "react";
import "./Stats.css";

const stats = [
  { end: 500, suffix: "+", label: "Happy Guests" },
  { end: 5, suffix: "", label: "Prime Locations" },
  { end: 60, suffix: "+", label: "Premium Rooms" },
];

function CountUp({ end, suffix }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const current = Math.floor(progress * end);
      setValue(current);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="lux-stats">
      <div className="container">

        {/* HEADING */}
        <div className="lux-stats-header text-center">
          <h3 className="lux-stats-title">Trusted by Thousands</h3>
          <p className="lux-stats-subtitle">
            Numbers that reflect our commitment to premium living
          </p>
        </div>

        {/* STATS */}
        <div className="row text-center align-items-center g-0">
          {stats.map((s, i) => (
            <div key={i} className="col-md-4 lux-stat-col">
              <div className="lux-stat-card">
                <h2 className="lux-stat-value">
                  <CountUp end={s.end} suffix={s.suffix} />
                </h2>
                <p className="lux-stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
