import "./About.css";

export default function About() {
  return (
    <section className="lux-about">
      <div className="container">

        <div className="lux-about-header text-center">
          <h2 className="lux-about-title">
            <i className="bi bi-buildings"></i> About Jupiter PG
          </h2>
          <p className="lux-about-subtitle">
            Premium PG and apartment living across the city
          </p>
        </div>

        <div className="lux-about-card">
          <p>
            <i className="bi bi-geo-alt-fill"></i>
            Jupiter PG is a professionally managed PG and apartment
            accommodation brand operating multiple branches across the city.
          </p>

          <p>
            <i className="bi bi-shield-check"></i>
            Each Jupiter PG location is designed with a strong focus on safety,
            cleanliness, and modern amenities for students and working professionals.
          </p>

          <p>
            <i className="bi bi-stars"></i>
            Our mission is to simplify urban living by offering reliable,
            transparent, and high-quality accommodation with consistent service
            standards across all branches.
          </p>
        </div>

      </div>
    </section>
  );
}
