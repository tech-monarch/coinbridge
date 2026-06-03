import { Link } from "react-router-dom";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.floatLeft} aria-hidden="true">
          <div className={styles.coinIcon} style={{ background: "#00c853" }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#00c853" />
              <text
                x="12"
                y="17"
                textAnchor="middle"
                fill="white"
                fontSize="13"
                fontWeight="bold"
              >
                $
              </text>
            </svg>
          </div>
        </div>

        <div className={styles.content} data-aos="zoom-in">
          <h2 className={styles.heading}>
            Ready to Start Your Investment Journey?
          </h2>
          <p className={styles.sub}>
            Join millions of users growing their wealth with Altioda.
          </p>
          <Link to="/register" className={styles.btn}>
            Create Free Account &nbsp;→
          </Link>
        </div>

        <div className={styles.floatRight} aria-hidden="true">
          <div className={styles.coinIcon} style={{ background: "#f7931a" }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#f7931a" />
              <text
                x="12"
                y="17"
                textAnchor="middle"
                fill="white"
                fontSize="11"
                fontWeight="bold"
              >
                ₿
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
