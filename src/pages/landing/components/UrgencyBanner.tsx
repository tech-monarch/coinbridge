import { Link } from "react-router-dom";
import styles from "./UrgencyBanner.module.css";

export default function UrgencyBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.rocket} data-aos="fade-right">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/SpaceX_Crew_Dragon_-_49096206_1933138203434533_3393553444888502272_o.jpg/400px-SpaceX_Crew_Dragon_-_49096206_1933138203434533_3393553444888502272_o.jpg"
            alt="Rocket launch"
            className={styles.rocketImg}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = "none";
              const svg = img.nextElementSibling as HTMLElement;
              if (svg) svg.style.display = "block";
            }}
          />
          {/* Fallback inline SVG rocket */}
          <svg
            style={{ display: "none" }}
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.rocketSvg}
          >
            <ellipse cx="40" cy="28" rx="14" ry="22" fill="white" fillOpacity="0.95" />
            <polygon points="26,32 18,54 40,44 62,54 54,32" fill="white" fillOpacity="0.9" />
            <polygon points="26,32 16,22 26,16" fill="#e0e0e0" />
            <polygon points="54,32 64,22 54,16" fill="#e0e0e0" />
            <circle cx="40" cy="25" r="6" fill="#1e88e5" />
            <ellipse cx="40" cy="54" rx="8" ry="5" fill="#ff6d00" fillOpacity="0.8" />
            <ellipse cx="40" cy="58" rx="5" ry="8" fill="#ffb300" fillOpacity="0.6" />
          </svg>
        </div>

        <div className={styles.content} data-aos="fade-up" data-aos-delay="100">
          <h2 className={styles.heading}>
            The Future of Money is Digital — Don't Get Left Behind
          </h2>
          <p className={styles.sub}>
            More people are joining the crypto revolution every day.
            <br />
            Start today and take control of your financial future.
          </p>
        </div>

        <Link
          to="/register"
          className={styles.btn}
          data-aos="fade-left"
          data-aos-delay="150"
        >
          Create Free Account &nbsp;→
        </Link>
      </div>
    </section>
  );
}
