import "./Amenities.css";

const amenities = [
  {
    title: "24x7 Security",
    icon: "bi-shield-lock",
    items: ["CCTV monitored premises", "Secure access control"],
    gradient: "lux-gold",
  },
  {
    title: "Premium Hygiene",
    icon: "bi-stars",
    items: ["Daily housekeeping", "Professional laundry"],
    gradient: "lux-emerald",
  },
  {
    title: "Purified Water",
    icon: "bi-droplet",
    items: ["RO + UV treated water", "Hot & cold supply"],
    gradient: "lux-sapphire",
  },
  {
    title: "Luxury Comfort",
    icon: "bi-house-heart",
    items: ["Hotel-grade bedding", "Private wardrobes"],
    gradient: "lux-amethyst",
  },
  {
    title: "High-Speed Internet",
    icon: "bi-wifi",
    items: ["Unlimited Wi-Fi", "Smart TV access"],
    gradient: "lux-sunset",
  },
  {
    title: "Managed Living",
    icon: "bi-headset",
    items: ["Dedicated support team", "Fast issue resolution"],
    gradient: "lux-rose",
  },
];

export default function Amenities() {
  return (
    <section id="amenities" className="lux-section">
      <div className="container">

        {/* HEADER */}
        <div className="text-center lux-header">
          <h2 className="lux-title">Luxury Amenities</h2>
          <p className="lux-subtitle">
            Designed for comfort, curated for premium living
          </p>
        </div>

        {/* GRID */}
        <div className="row g-4">
          {amenities.map((a, i) => (
            <div key={i} className="col-sm-6 col-md-4 col-lg-3">
              <div className={`lux-card ${a.gradient}`}>

                {/* ICON */}
                <div className="lux-icon">
                  <i className={`bi ${a.icon}`} />
                </div>

                {/* CONTENT */}
                <h5 className="lux-card-title">{a.title}</h5>

                <ul className="lux-list">
                  {a.items.map((item, idx) => (
                    <li key={idx}>
                      <i className="bi bi-check2-circle" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
