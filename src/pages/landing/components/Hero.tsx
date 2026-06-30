import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div
          className={styles.content}
          data-aos="fade-right"
          data-aos-delay="100"
        >
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>IRA-compatible crypto platform</span>
          </div>

          <h1 className={styles.headline}>
            Buy, Trade &amp; Grow
            <br />
            Your Crypto <br />
            <span className={styles.accent}>Safely and </span>
            <span className={styles.highlight}>Effortlessly</span>
          </h1>
          <p className={styles.sub}>
            Invest in 200+ cryptocurrencies — including through Traditional,
            <br />
            Roth, and SEP IRAs — with the speed, security, and simplicity
            <br />
            you deserve.
          </p>

          <div
            className={styles.features}
            data-aos="fade-right"
            data-aos-delay="250"
          >
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <span>Secure &amp;<br />Encrypted</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
              </span>
              <span>Fast Deposits<br />&amp; Withdrawals</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </span>
              <span>Beginner<br />Friendly</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </span>
              <span>24/7 Market<br />Access</span>
            </div>
          </div>

          <div className={styles.ctas} data-aos="fade-up" data-aos-delay="400">
            <Link to="/register" className={styles.primaryBtn}>
              Create Free Account &nbsp;→
            </Link>
            
            <a  href="https://t.me/Altioda"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
              style={{ textDecoration: "none" }}
            >
              <span className={styles.playIcon}>▶</span>
              Explore How It Works
            </a>
          </div>

          <div className={styles.trustRow} data-aos="fade-up" data-aos-delay="460">
            <div className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00c853" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              IRA custodian
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00c853" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              FDIC-insured cash balances
            </div>
            <div className={styles.trustDivider} />
            <div className={styles.trustItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00c853" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Coinbase custody
            </div>
          </div>
        </div>

        <div
          className={styles.visual}
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <div className={styles.heroImageWrap}>
            <div className={styles.imagePlaceholder}>
              <img src="/hero-image.webp" alt="crypto" className={styles.heroImg} />
            </div>

            {/* BTC badge — top right */}
            <div className={styles.floatBadge1}>
              <div className={styles.coinBadge}>
                <img src="/btc.png" alt="Bitcoin" className={styles.coinImg} />
                <div className={styles.coinLabel}>
                  <span className={styles.coinName}>BTC</span>
                  <span className={styles.coinSub}>Bitcoin</span>
                </div>
              </div>
            </div>

            {/* ETH badge — bottom left */}
            <div className={styles.floatBadge2}>
              <div className={styles.coinBadge}>
                <img src="/eth.png" alt="Ethereum" className={styles.coinImg} />
                <div className={styles.coinLabel}>
                  <span className={styles.coinName}>ETH</span>
                  <span className={styles.coinSub}>Ethereum</span>
                </div>
              </div>
            </div>

            {/* BNB badge — bottom right */}
            <div className={styles.floatBadge3}>
              <div className={styles.coinBadge}>
                <img src="/bnb.png" alt="BNB" className={styles.coinImg} />
                <div className={styles.coinLabel}>
                  <span className={styles.coinName}>BNB</span>
                  <span className={styles.coinSub}>BNB Chain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}