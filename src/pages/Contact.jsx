import "./Contact.css";

export default function Contact() {
  return (
    <section className="lux-contact">
      <div className="container">

        <div className="lux-contact-header text-center">
          <h2 className="lux-contact-title">
            <i className="bi bi-headset"></i> Contact Jupiter PG
          </h2>
          <p className="lux-contact-subtitle">
            Get in touch for availability across our city-wide branches
          </p>
        </div>

        <div className="lux-contact-card">
          <div className="lux-contact-item">
            <i className="bi bi-envelope-fill"></i>
            <div>
              <h6>Email</h6>
              <p>support@jupiterpg.com</p>
            </div>
          </div>

          <div className="lux-contact-item">
            <i className="bi bi-telephone-fill"></i>
            <div>
              <h6>Phone</h6>
              <p>+91 9579797979</p>
            </div>
          </div>

          <div className="lux-contact-item">
            <i className="bi bi-geo-alt-fill"></i>
            <div>
              <h6>Locations</h6>
              <p>Hinjewadi Phase 1, Pune, Maharashtra</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
