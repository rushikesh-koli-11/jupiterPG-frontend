import "./FAQ.css";
export default function FAQ() {
  return (
    <section id="faq" className="lux-section">
      <div className="container">

        <div className="lux-header text-center">
          <h2 className="lux-title">Got questions? We’ve got answers.</h2>
          <p className="lux-subtitle">
            Everything you need to know before choosing your next stay
          </p>
        </div>

        <div className="accordion lux-faq" id="faqAcc">

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#q1"
              >
                In which cities do you operate?
              </button>
            </h2>
            <div id="q1" className="accordion-collapse collapse show">
              <div className="accordion-body">
                Currently, we operate in Pune, with plans to expand to other major cities soon.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#q2"
              >
                What amenities are included in the rent?
              </button>
            </h2>
            <div id="q2" className="accordion-collapse collapse">
              <div className="accordion-body">
                Rent includes fully furnished rooms, high-speed Wi-Fi, housekeeping,
                security, purified water, and access to common areas.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#q3"
              >
                Is food included in the pricing?
              </button>
            </h2>
            <div id="q3" className="accordion-collapse collapse">
              <div className="accordion-body">
                Food is optional and may be charged separately depending on the property.
                Details are clearly mentioned on each listing.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#q4"
              >
                What is the minimum stay duration?
              </button>
            </h2>
            <div id="q4" className="accordion-collapse collapse">
              <div className="accordion-body">
                The minimum stay duration is typically one month, but this may vary
                depending on the property.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#q5"
              >
                Is the accommodation safe for working professionals and students?
              </button>
            </h2>
            <div id="q5" className="accordion-collapse collapse">
              <div className="accordion-body">
                Yes. All our properties are professionally managed and equipped with
                CCTV surveillance, controlled access, and dedicated support staff.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
