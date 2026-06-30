import { Link } from "react-router-dom";
import type { Feature } from "@/types";
import styles from "./Features.module.css";

const features: Feature[] = [
  {
    title: "Real-time Market Data",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e88e5"
        strokeWidth="2"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Multiple Trading Options",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e88e5"
        strokeWidth="2"
      >
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    title: "Coinbase-Backed Wallet",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e88e5"
        strokeWidth="2"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Instant Transactions",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e88e5"
        strokeWidth="2"
      >
        <polyline points="13 2 13 9 20 9" />
        <path d="M11 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
      </svg>
    ),
  },
  {
    title: "Portfolio Tracking",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e88e5"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: "24/7 Live Support",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e88e5"
        strokeWidth="2"
      >
        <path d="M3 18v-6a9 9 0 0118 0v6" />
        <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="buy-crypto" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.left} data-aos="fade-right">
          <p className={styles.label}>Powerful Features</p>
          <h2 className={styles.heading}>
            Everything You Need to
            <br />
            Grow Your Money
          </h2>
          <p className={styles.desc}>
            Altioda brings together the tools, data, and support you need to
            trade smarter and invest with confidence — whether you're new to
            crypto or a seasoned market participant.
          </p>
          <Link to="/register" className={styles.exploreBtn} style={{ textDecoration: "none", display: "inline-block" }}>
            Explore Features &nbsp;→
          </Link>
        </div>

        <div className={styles.right} data-aos="fade-left" data-aos-delay="100">
          <div className={styles.grid}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className={styles.featureCard}
                data-aos="zoom-in"
                data-aos-delay={i * 60}
              >
                <div className={styles.iconWrap}>{f.icon}</div>
                <span className={styles.featureTitle}>{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
