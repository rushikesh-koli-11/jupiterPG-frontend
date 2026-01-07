import "./Footer.css";

export default function Footer() {
  return (
    <footer className="lux-footer">
      <div className="container">

        <div className="row gy-4">

          <div className="col-lg-4 col-md-6">
            <h3 className="lux-footer-brand">
              <i className="bi bi-building"></i> Jupiter PG
            </h3>
            <p className="lux-footer-text">
              Jupiter PG is a professionally managed PG and apartment
              accommodation brand operating multiple branches across the city,
              offering safe and comfortable living for students and
              working professionals.
            </p>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="lux-footer-title">Quick Links</h5>
            <ul className="lux-footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
              <li><a href="/disclaimer">Disclaimer</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="lux-footer-title">Contact</h5>
            <ul className="lux-footer-contact">
              <li><i className="bi bi-envelope"></i> support@jupiterpg.com</li>
              <li><i className="bi bi-telephone"></i> +91 9579695273</li>
              <li><i className="bi bi-geo-alt"></i> Pune, Maharashtra</li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="lux-footer-title">Follow Us</h5>
            <div className="lux-footer-socials">
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

        </div>

        <div className="lux-footer-bottom">
          <p>© {new Date().getFullYear()} Jupiter PG. All rights reserved.</p>
          <p>Designed and Developed by <b>Rushikesh Koli</b></p>
        </div>

      </div>
    </footer>
  );
}
