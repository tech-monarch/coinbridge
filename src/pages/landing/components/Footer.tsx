import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const footerLinks = {
  Products: ["Buy Crypto", "Exchange", "Wallet", "Pricing"],
  Company: ["About Us", "Careers", "Blog", "Contact Us"],
  Resources: ["Academy", "Help Center", "Guides", "API"],
  Legal: ["Terms of Use", "Privacy Policy", "Risk Disclosure", "AML Policy"],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand} data-aos="fade-up">
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <img
                  src="/def167e0-80fb-45ae-81a0-633728502489.jpg"
                  alt="Altioda"
                  className={styles.logoImg}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.display = "none";
                    const fallback = img.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div className={styles.logoFallback}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="6" fill="#1e88e5" />
                    <circle cx="14" cy="14" r="6" stroke="white" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
              <span className={styles.logoText}>Altioda</span>
            </Link>
            <p className={styles.tagline}>
              Your trusted platform for crypto trading, investing and financial freedom.
            </p>
            <div className={styles.socials}>
              {["f", "t", "in"].map((s) => (
                <a key={s} href="#" className={styles.social}>{s}</a>
              ))}
            </div>
          </div>

          <div className={styles.links}>
            {Object.entries(footerLinks).map(([col, items], i) => (
              <div
                key={col}
                className={styles.col}
                data-aos="fade-up"
                data-aos-delay={i * 60}
              >
                <h4 className={styles.colTitle}>{col}</h4>
                <ul>
                  {items.map((item) => (
                    <li key={item}><a href="#">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© 2025 Altioda. All rights reserved.</p>
          <div className={styles.lang}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#607080" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            English
          </div>
        </div>
      </div>
    </footer>
  );
}
