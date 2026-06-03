import styles from "./TradingCTA.module.css";

export default function TradingCTA() {
  return (
    <div className={styles.banner}>
      {/* Left text */}
      <div className={styles.left}>
        <h3 className={styles.heading}>Start Trading Now</h3>
        <p className={styles.sub}>
          Explore 100+ cryptocurrencies and grow your portfolio today.
        </p>
      </div>

      {/* Phone illustration */}
      <div className={styles.phoneIllustration}>
        <PhoneIllustration />
      </div>

      {/* Feature items */}
      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <ShieldIcon />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>Low Fees</span>
            <span className={styles.featureSub}>
              Competitive trading fees in the market
            </span>
          </div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <LockIcon />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>Secure Platform</span>
            <span className={styles.featureSub}>
              Bank-level security to protect your funds
            </span>
          </div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>
            <HeadphonesIcon />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>24/7 Support</span>
            <span className={styles.featureSub}>Get help anytime you need</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <a
        href="https://t.me/Altioda_official"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ctaBtn}
        style={{ textDecoration: "none" }}
      >
        Join Academy
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </div>
  );
}

function PhoneIllustration() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
      {/* Phone body */}
      <rect x="30" y="4" width="36" height="62" rx="5" fill="#1a3a6e" />
      <rect x="33" y="10" width="30" height="44" rx="2" fill="#0d2052" />
      {/* Screen content - mini chart */}
      <polyline
        points="37,48 42,38 47,35 52,28 57,20 60,16"
        stroke="#00e676"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="60" cy="16" r="2" fill="#00e676" />
      {/* Home button */}
      <circle cx="48" cy="60" r="2" fill="#2a4a8e" />
      {/* Coins */}
      <circle cx="14" cy="50" r="12" fill="#f59e0b" />
      <text
        x="8"
        y="55"
        fontSize="10"
        fontWeight="800"
        fill="white"
        fontFamily="Arial"
      >
        $
      </text>
      <circle cx="20" cy="62" r="10" fill="#f7931a" />
      <text
        x="14"
        y="67"
        fontSize="9"
        fontWeight="800"
        fill="white"
        fontFamily="Arial"
      >
        ₿
      </text>
      {/* Small coin right */}
      <circle cx="92" cy="40" r="10" fill="#627eea" />
      <polygon points="92,30 97,41 87,41" fill="rgba(255,255,255,0.9)" />
      {/* Chart bars */}
      <rect
        x="80"
        y="55"
        width="5"
        height="15"
        rx="2"
        fill="#00c853"
        opacity="0.7"
      />
      <rect
        x="88"
        y="50"
        width="5"
        height="20"
        rx="2"
        fill="#00c853"
        opacity="0.85"
      />
      <rect
        x="96"
        y="58"
        width="5"
        height="12"
        rx="2"
        fill="#00c853"
        opacity="0.6"
      />
      <rect x="104" y="46" width="5" height="24" rx="2" fill="#00c853" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1565C0"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1565C0"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1565C0"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0118 0v6" />
      <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z" />
      <path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
    </svg>
  );
}
