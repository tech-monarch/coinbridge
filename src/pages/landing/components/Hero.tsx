import { useRef } from "react";
import { Link } from "react-router-dom";
import { useMagnetic } from "@/hooks/useMagnetic";
import styles from "./Hero.module.css";

export default function Hero() {
  const magnetic = useMagnetic<HTMLAnchorElement>(0.3, 2);
  const heroRef = useRef<HTMLElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const node = heroRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty("--spot-x", `${x}%`);
    node.style.setProperty("--spot-y", `${y}%`);
  };

  return (
    <section
      id="home"
      className={styles.hero}
      ref={heroRef}
      onPointerMove={handlePointerMove}
    >
      <div className={styles.spotlight} />
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

          <div className={styles.ctas} data-aos="fade-up" data-aos-delay="250">
            <Link
              to="/register"
              className={styles.primaryBtn}
              ref={magnetic.ref}
              onPointerMove={magnetic.onPointerMove}
              onPointerEnter={magnetic.onPointerEnter}
              onPointerLeave={magnetic.onPointerLeave}
            >
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

          <div className={styles.trustRow} data-aos="fade-up" data-aos-delay="360">
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