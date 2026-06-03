import styles from './SocialProof.module.css';

export default function SocialProof() {
  return (
    <div className={styles.bar}>
      <div className={styles.container}>
        <div className={styles.item} data-aos="fade-up" data-aos-delay="0">
          <span className={styles.icon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#1e2d45" opacity="0.5"/>
              <path d="M14 22c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#1e88e5" strokeWidth="2" fill="none"/>
              <circle cx="20" cy="16" r="3" stroke="#1e88e5" strokeWidth="2" fill="none"/>
              <path d="M10 26c0-2.761 2.239-5 5-5M30 26c0-2.761-2.239-5-5-5" stroke="#1e88e5" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="20" r="2" stroke="#1e88e5" strokeWidth="1.5" fill="none"/>
              <circle cx="30" cy="20" r="2" stroke="#1e88e5" strokeWidth="1.5" fill="none"/>
            </svg>
          </span>
          <div>
            <div className={styles.num}>7M+</div>
            <div className={styles.label}>Users Worldwide</div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.item} data-aos="fade-up" data-aos-delay="100">
          <span className={styles.icon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#1e2d45" opacity="0.5"/>
              <rect x="12" y="14" width="16" height="12" rx="2" stroke="#1e88e5" strokeWidth="2" fill="none"/>
              <path d="M16 18h8M16 22h5" stroke="#1e88e5" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="27" cy="13" r="4" fill="#0a0e1a" stroke="#1e88e5" strokeWidth="1.5"/>
              <path d="M25 13h4M27 11v4" stroke="#1e88e5" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </span>
          <div>
            <div className={styles.num}>10+</div>
            <div className={styles.label}>Digital Assets</div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.item} data-aos="fade-up" data-aos-delay="200">
          <span className={styles.icon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#1e2d45" opacity="0.5"/>
              <circle cx="20" cy="20" r="8" stroke="#1e88e5" strokeWidth="2" fill="none"/>
              <path d="M20 14v6l3 3" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <div>
            <div className={styles.num}>24/7</div>
            <div className={styles.label}>Active Trading</div>
          </div>
        </div>
      </div>
    </div>
  );
}
