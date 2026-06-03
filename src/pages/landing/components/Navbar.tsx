import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const NAV_ITEMS = [
  { label: "Home",       id: "home"       },
  { label: "Buy Crypto", id: "buy-crypto" },
  { label: "Exchange",   id: "exchange"   },
  { label: "Academy",    id: "academy"    },
  { label: "About Us",   id: "about-us"   },
];

const NAV_HEIGHT = 64;

export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [activeId, setActiveId]     = useState("home");
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Scrolled-shadow state
      setScrolled(window.scrollY > 10);

      // Active section detection — find the section whose top edge is
      // at or just above the bottom of the navbar
      const threshold = NAV_HEIGHT + 24;
      let current = NAV_ITEMS[0].id;

      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
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
                <path d="M8 14C8 10.686 10.686 8 14 8s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" fill="white" />
                <path d="M14 10v8M10 14h8" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <span className={styles.logoText}>Altioda</span>
        </Link>

        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          {NAV_ITEMS.map(({ label, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeId === id ? styles.active : ""}
                onClick={(e) => handleNavClick(e, id)}
              >
                {label}
                {activeId === id && <span className={styles.activeDot} />}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.navActions}>
          <div className={styles.searchBox}>
            <input type="text" placeholder="Search..." />
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#78909c" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <Link to="/login" className={styles.loginBtn}>Login</Link>
          <Link to="/register" className={styles.createBtn}>Create Account</Link>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? styles.barOpen : ""} />
          <span className={menuOpen ? styles.barMiddleOpen : ""} />
          <span className={menuOpen ? styles.barOpen : ""} />
        </button>
      </div>
    </nav>
  );
}
