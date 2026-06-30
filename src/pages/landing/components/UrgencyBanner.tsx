import { Link } from "react-router-dom";
import styles from "./UrgencyBanner.module.css";

export default function UrgencyBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.rocket} data-aos="fade-right">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <rect width="52" height="52" rx="12" fill="rgba(255,255,255,0.12)" />
            <polyline points="10,38 20,26 28,32 42,14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <polyline points="36,14 42,14 42,20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="10" cy="38" r="3" fill="white" fillOpacity="0.5" />
            <circle cx="20" cy="26" r="3" fill="white" fillOpacity="0.7" />
            <circle cx="28" cy="32" r="3" fill="white" fillOpacity="0.7" />
            <circle cx="42" cy="14" r="3.5" fill="white" />
          </svg>
        </div>

        <div className={styles.content} data-aos="fade-up" data-aos-delay="100">
          <h2 className={styles.heading}>
            The Digital Asset Revolution Is Already Underway
          </h2>
          <p className={styles.sub}>
            More investors are allocating to crypto every quarter.
            <br />
            Whether you're securing retirement funds or building a new
            portfolio, there's no better time to get started.
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
