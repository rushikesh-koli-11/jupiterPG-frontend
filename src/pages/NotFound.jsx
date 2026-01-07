import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="notfound-section">
      <div className="container text-center">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-text">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link to="/" className="notfound-btn">
          Go Back Home
        </Link>
      </div>
    </section>
  );
}
