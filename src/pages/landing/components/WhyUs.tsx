import type { Reason } from "@/types";
import styles from "./WhyUs.module.css";

const reasons: Reason[] = [
  {
    title: "For Everyone",
    desc: "Built for beginners and experienced investors alike, including those diversifying retirement funds.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle
          cx="18"
          cy="14"
          r="5"
          stroke="#00c853"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M8 30c0-5.523 4.477-10 10-10s10 4.477 10 10"
          stroke="#00c853"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx="28"
          cy="12"
          r="3.5"
          fill="none"
          stroke="#00c853"
          strokeWidth="1.5"
        />
        <path
          d="M26.5 12h3M28 10.5v3"
          stroke="#00c853"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Fast & Reliable",
    desc: "Seamless deposits and withdrawals, with a transparent 1% trading fee and no hidden charges.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M21 6l-8 12h7l-6 12 14-16h-8l5-8z"
          fill="#ffc107"
          fillOpacity="0.2"
          stroke="#ffc107"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Powerful Yet Simple",
    desc: "Advanced features with an easy-to-use interface.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M8 26l6-6 4 4 10-12"
          stroke="#00c853"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="6"
          y="6"
          width="8"
          height="8"
          rx="2"
          stroke="#00c853"
          strokeWidth="1.5"
          fill="none"
          fillOpacity="0.2"
        />
        <rect
          x="22"
          y="22"
          width="8"
          height="8"
          rx="2"
          stroke="#00c853"
          strokeWidth="1.5"
          fill="none"
          fillOpacity="0.2"
        />
      </svg>
    ),
  },
  {
    title: "Support You Can Count On",
    desc: "Real people, available around the clock on WhatsApp or Telegram.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M5 22v-6a13 13 0 0126 0v6"
          stroke="#1e88e5"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M31 23a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM7 23a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H7z"
          stroke="#1e88e5"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
];

export default function WhyUs() {
  return (
    <section id="about-us" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading} data-aos="fade-up">
          Why Altioda Stands Out
        </h2>
        <div className={styles.grid}>
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className={styles.card}
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className={styles.iconWrap}>{r.icon}</div>
              <h3 className={styles.cardTitle}>{r.title}</h3>
              <p className={styles.cardDesc}>{r.desc}</p>
              {r.title === "Support You Can Count On" && (
                <p className={styles.contactLinks}>
                  <a href="https://wa.me/12022000794" target="_blank" rel="noopener noreferrer" style={{ marginRight: 10 }}>
                    WhatsApp ↗
                  </a>
                  <a href="https://t.me/Altioda" target="_blank" rel="noopener noreferrer">
                    Telegram ↗
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
