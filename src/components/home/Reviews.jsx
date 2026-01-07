import "./Reviews.css";

import review1 from "../../assets/review-1.jpg";
import review2 from "../../assets/review-2.jpg";
import review3 from "../../assets/review-3.jpg";
import review4 from "../../assets/review-4.jpg";
import googleLogo from "../../assets/google-logo.png";

const reviews = [
  {
    name: "Snehal Kawale",
    time: "1 year ago",
    rating: 5,
    text:
      "Jupiter PG is one of the best PGs in Pune. Rooms are clean, well maintained, and the location is perfect.",
  },
  {
    name: "Parichay Baraik",
    time: "1 year ago",
    rating: 5,
    text:
      "It’s been a calm and pleasant experience for me for almost 2 years. Good services and responsive staff.",
  },
  {
    name: "Neha Gore",
    time: "1 year ago",
    rating: 5,
    text:
      "This was my first PG experience and Jupiter PG made it comfortable and hassle-free.",
  },
  {
    name: "D S",
    time: "1 year ago",
    rating: 5,
    text:
      "Professionally managed PG with excellent hygiene and safety. Highly recommended.",
  },
];

export default function Reviews() {
  return (
    <section className="lux-reviews">
      <div className="container">
        {/* HEADER */}
        <div className="lux-header text-center">
          <h2 className="lux-title">Meet the happy faces</h2>
          <p className="lux-subtitle">
            Our residents come for the comfort — and stay for the people,
            community, and care.
          </p>
        </div>

        <div className="lux-reviews-grid">
          {/* LEFT – IMAGES */}
          <div className="lux-review-images">
            <img src={review1} alt="Happy residents" />
            <img src={review2} alt="Jupiter PG residents" />
            <img src={review3} alt="Community moments" />
            <img src={review4} alt="Resident events" />
          </div>

          {/* RIGHT – REVIEW CARDS */}
          <div className="lux-review-cards">
            {reviews.map((r, i) => (
              <div key={i} className="lux-review-card">
                <div className="lux-review-header">
                  <h5>{r.name}</h5>
                  <span>{r.time}</span>
                </div>

                <div className="lux-stars">
                  {"★".repeat(r.rating)}
                </div>

                <p className="lux-review-text">{r.text}</p>

                <div className="lux-google">
                  <img src={googleLogo} alt="Google" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
