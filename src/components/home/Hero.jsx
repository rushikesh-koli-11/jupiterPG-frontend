import "./Hero.css";

import hero1 from "../../assets/hero-room-1.jpg";
import hero2 from "../../assets/hero-room-2.jpg";
import hero3 from "../../assets/hero-room-3.jpg";

export default function Hero() {
  return (
    <section className="lux-hero">
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT CONTENT */}
          <div className="col-lg-5 col-md-12 lux-hero-content">
            <span className="lux-badge">Premium PG Living</span>

            <h1 className="lux-hero-title">
              Experience <span>Luxury</span> Living
              <br /> Designed for Comfort
            </h1>

            <p className="lux-hero-subtitle">
              Fully furnished premium PG accommodations with hotel-grade
              comfort, security, and lifestyle amenities.
            </p>

            <button
              className="lux-btn"
              onClick={() =>
                document
                  .getElementById("apartments")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Apartments
            </button>
          </div>

          {/* RIGHT CAROUSEL */}
          <div className="col-lg-7 col-md-12">
            <div
              id="luxHeroCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
              data-bs-interval="4500"
            >
              <div className="carousel-inner lux-carousel rounded-4 shadow-lg">

                <div className="carousel-item active">
                  <img
                    src={hero1}
                    alt="Luxury PG Room Interior"
                    className="d-block w-100 lux-hero-img"
                  />
                </div>

                <div className="carousel-item">
                  <img
                    src={hero2}
                    alt="Premium Furnished PG Room"
                    className="d-block w-100 lux-hero-img"
                  />
                </div>

                <div className="carousel-item">
                  <img
                    src={hero3}
                    alt="Modern PG Accommodation"
                    className="d-block w-100 lux-hero-img"
                  />
                </div>

              </div>

              {/* CONTROLS */}
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#luxHeroCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" />
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#luxHeroCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
