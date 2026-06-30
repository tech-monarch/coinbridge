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
            Start Building Your Digital Portfolio Today
          </h2>
          <p className={styles.sub}>
            Join Altioda — the platform that lets you trade 200+ cryptocurrencies
            and invest retirement funds, all in one secure, easy-to-use place.
          </p>
          <Link to="/register" className={styles.btn}>
            Create Free Account &nbsp;→
          </Link>

          <div className={styles.trustRow}>
            <span className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a6278" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              No minimum to start
            </span>
            <span className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a6278" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              IRA-compatible
            </span>
            <span className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a6278" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              FDIC-insured funds
            </span>
            <span className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a6278" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              1% flat trading fee
            </span>
          </div>
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
