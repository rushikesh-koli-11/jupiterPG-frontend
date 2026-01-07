import "./Disclaimer.css";

export default function Disclaimer() {
  return (
    <section className="lux-disclaimer">
      <div className="container">

        <div className="lux-disclaimer-header text-center">
          <h2 className="lux-disclaimer-title">
            <i className="bi bi-exclamation-circle-fill"></i> Disclaimer
          </h2>
          <p className="lux-disclaimer-subtitle">
            Important information regarding Jupiter PG services
          </p>
        </div>

        <div className="lux-disclaimer-card">

          <div className="lux-disclaimer-item">
            <i className="bi bi-buildings"></i>
            <p>
              Jupiter PG operates and manages multiple PG and apartment
              properties across different locations in the city.
            </p>
          </div>

          <div className="lux-disclaimer-item">
            <i className="bi bi-image"></i>
            <p>
              Images, amenities, pricing, and availability may vary based
              on location, room type, and branch.
            </p>
          </div>

          <div className="lux-disclaimer-item">
            <i className="bi bi-info-circle"></i>
            <p>
              All information on this website is provided for general
              informational purposes and is subject to change without notice.
            </p>
          </div>

          <div className="lux-disclaimer-item">
            <i className="bi bi-shield-x"></i>
            <p>
              Jupiter PG shall not be liable for discrepancies arising
              due to location-specific variations or third-party dependencies.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
