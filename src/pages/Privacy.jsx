import "./Privacy.css";

export default function Privacy() {
  return (
    <section className="lux-privacy">
      <div className="container">

        <div className="lux-privacy-header text-center">
          <h2 className="lux-privacy-title">
            <i className="bi bi-shield-lock-fill"></i> Privacy Policy
          </h2>
          <p className="lux-privacy-subtitle">
            Your information is handled with care and responsibility
          </p>
        </div>

        <div className="lux-privacy-card">

          <div className="lux-privacy-item">
            <i className="bi bi-person-lock"></i>
            <p>
              Jupiter PG is committed to protecting the privacy of users across
              all its PG and apartment locations.
            </p>
          </div>

          <div className="lux-privacy-item">
            <i className="bi bi-database-lock"></i>
            <p>
              We collect only essential information such as name, contact
              details, and accommodation preferences to assist with enquiries,
              bookings, and support.
            </p>
          </div>

          <div className="lux-privacy-item">
            <i className="bi bi-shield-check"></i>
            <p>
              Personal data is never sold, rented, or shared with third parties,
              except where required by law or necessary for operational purposes.
            </p>
          </div>

          <div className="lux-privacy-item">
            <i className="bi bi-check-circle"></i>
            <p>
              By using the Jupiter PG website or services, you consent to the
              collection and use of information as outlined in this policy.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
