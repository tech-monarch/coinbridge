import styles from "./Security.module.css";

const badges = [
  "FDIC-Insured Cash Balances",
  "Coinbase Digital Asset Custody",
  "Cyber Liability Insurance",
  "Crime Insurance for Assets",
];

export default function Security() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.imageArea} data-aos="fade-right">
          <div className={styles.shieldPlaceholder}>
            <img
              src="/security-in-crypto.jpg"
              alt="security shield"
              className={styles.shieldImg}
            />
          </div>
        </div>
        <div
          className={styles.content}
          data-aos="fade-left"
          data-aos-delay="100"
        >
          <p className={styles.label}>Your Security is Our Priority</p>
          <h2 className={styles.heading}>
            Built for Security &amp; Transparency
          </h2>
          <p className={styles.desc}>
            Your funds are protected by multiple independent layers of security.
            Cash balances are FDIC-insured up to $250,000 through our banking
            partners, digital assets are custodied through Coinbase, and we
            carry both cyber liability and crime insurance — so you can invest
            with genuine peace of mind.
          </p>
          <div className={styles.badges}>
            {badges.map((b) => (
              <span key={b} className={styles.badge}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00c853"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
