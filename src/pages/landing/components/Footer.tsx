import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const footerLinks = {
  Products: ["Buy Crypto", "IRA Investing", "Exchange", "Wallet", "Pricing"],
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
              Altioda is a trusted IRA custodian and crypto investment platform.
              Grow your wealth with the security and transparency you deserve.
            </p>
            <div className={styles.socials}>
              <a
                href="https://wa.me/12022000794"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.social} ${styles.socialWa}`}
                aria-label="WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.534 5.856L.057 23.493a.5.5 0 00.604.628l5.78-1.516A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>
              <a
                href="https://t.me/Altioda"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.social} ${styles.socialTg}`}
                aria-label="Telegram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a href="#" className={`${styles.social} ${styles.socialTw}`} aria-label="Twitter / X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className={`${styles.social} ${styles.socialLi}`} aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
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
                  {items.map((item) =>
                    item === "Academy" ? (
                      <li key={item}>
                        <a href="https://t.me/Altioda" target="_blank" rel="noopener noreferrer">{item}</a>
                      </li>
                    ) : (
                      <li key={item}><a href="#">{item}</a></li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© 2025 Altioda. All rights reserved.</p>
          <p className={styles.disclosure}>
            Investing involves risk, including possible loss of principal. Carefully consider your investment
            risk, contribution limits, and platform experience before investing. Cash balances are FDIC-insured
            up to $250,000 through our banking partners; digital assets are custodied through Coinbase. IRA tax
            advantages are subject to IRS rules.
          </p>
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
