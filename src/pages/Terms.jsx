import "./Terms.css";

export default function Terms() {
  return (
    <section className="lux-terms">
      <div className="container">

        <div className="lux-terms-header text-center">
          <h2 className="lux-terms-title">
            <i className="bi bi-file-earmark-check-fill"></i> Terms & Conditions
          </h2>
          <p className="lux-terms-subtitle">
            Applicable across all Jupiter PG branches and apartments
          </p>
        </div>

        <div className="lux-terms-card">

          <div className="lux-terms-item">
            <i className="bi bi-check2-circle"></i>
            <p>
              By accessing or using Jupiter PG services, you agree to comply
              with these terms and conditions.
            </p>
          </div>

          <div className="lux-terms-item">
            <i className="bi bi-building"></i>
            <p>
              Rent, deposits, amenities, and house rules may vary depending
              on the specific Jupiter PG branch or apartment location.
            </p>
          </div>

          <div className="lux-terms-item">
            <i className="bi bi-person-badge"></i>
            <p>
              Users are responsible for providing accurate and complete
              information during enquiries and bookings.
            </p>
          </div>

          <div className="lux-terms-item">
            <i className="bi bi-shield-exclamation"></i>
            <p>
              Jupiter PG reserves the right to suspend access or update
              these terms for operational, legal, or security reasons.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
