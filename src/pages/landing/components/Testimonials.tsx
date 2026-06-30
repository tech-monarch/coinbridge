import { useCallback, useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/types";
import styles from "./Testimonials.module.css";

const testimonials: Testimonial[] = [
  {
    name: "Lars Eriksson",
    stars: 5,
    text: "Altioda is the best platform I've used. Fast transactions and great support — I'm genuinely impressed.",
    initials: "LE",
    color: "#1e88e5",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format",
  },
  {
    name: "Sophie Müller",
    stars: 5,
    text: "As a beginner, this platform is so easy to use. I started trading within minutes of signing up!",
    initials: "SM",
    color: "#00c853",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face&auto=format",
  },
  {
    name: "Marco Ferretti",
    stars: 5,
    text: "Secure, reliable and transparent. I've tried many crypto platforms and Altioda is by far the best.",
    initials: "MF",
    color: "#e53935",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format",
  },
  {
    name: "Anke Larsen",
    stars: 5,
    text: "Rolling part of my IRA into crypto felt complicated everywhere else. Altioda made it straightforward, and the fees were clear from day one.",
    initials: "AL",
    color: "#ff9800",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face&auto=format",
  },
  {
    name: "James Okafor",
    stars: 5,
    text: "I had a question about a withdrawal at midnight and got a real answer on WhatsApp within minutes. That kind of support is rare.",
    initials: "JO",
    color: "#6d4aff",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&auto=format",
  },
  {
    name: "Helena Castro",
    stars: 5,
    text: "I appreciate that the security details aren't buried in fine print. Knowing my cash balance is FDIC-insured made the decision easy.",
    initials: "HC",
    color: "#00897b",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face&auto=format",
  },
];

const AUTOPLAY_MS = 5500;

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </div>
  );
}

/** Shortest signed distance from `active` to `index` on a circular track. */
function circularDiff(index: number, active: number, len: number) {
  let diff = index - active;
  if (diff > len / 2) diff -= len;
  if (diff < -len / 2) diff += len;
  return diff;
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [spread, setSpread] = useState(230);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const len = testimonials.length;

  useEffect(() => {
    const updateSpread = () => {
      const w = window.innerWidth;
      if (w < 680) setSpread(130);
      else if (w < 1040) setSpread(170);
      else setSpread(230);
    };
    updateSpread();
    window.addEventListener("resize", updateSpread);
    return () => window.removeEventListener("resize", updateSpread);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % len) + len) % len);
    },
    [len]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Autoplay, paused on hover/focus
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % len);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, len]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading} data-aos="fade-up">
          What Our <span className={styles.accent}>Users Say</span>
        </h2>

        <div
          className={styles.stageOuter}
          data-aos="zoom-in"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="User testimonials"
        >
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={prev}
            aria-label="Previous testimonial"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={styles.stage}>
            {testimonials.map((t, i) => {
              const diff = circularDiff(i, active, len);
              const isCenter = diff === 0;
              const absDiff = Math.abs(diff);

              // Beyond ±2 cards away, park them off-stage (still in DOM for smooth re-entry)
              const visible = absDiff <= 2;
              const translateX = diff * spread;
              const translateZ = -absDiff * 130;
              const rotateY = diff * -28;
              const scale = Math.max(1 - absDiff * 0.14, 0.58);
              const opacity = visible ? Math.max(1 - absDiff * 0.45, 0) : 0;
              const zIndex = 10 - absDiff;

              return (
                <div
                  key={t.name}
                  className={`${styles.cardSlot} ${isCenter ? styles.center : ""}`}
                  style={{
                    transform: `translateX(-50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    pointerEvents: isCenter ? "auto" : visible ? "auto" : "none",
                  }}
                  onClick={() => !isCenter && goTo(i)}
                  aria-hidden={!visible}
                >
                  <div className={styles.card}>
                    <div className={styles.userRow}>
                      <div className={styles.avatarWrap}>
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className={styles.avatarImg}
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div className={styles.avatarFallback} style={{ background: t.color }}>
                          {t.initials}
                        </div>
                      </div>
                      <div>
                        <div className={styles.name}>{t.name}</div>
                        <span className={styles.verified}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Verified User
                        </span>
                        <Stars count={t.stars} />
                      </div>
                    </div>
                    <p className={styles.quote}>{t.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={next}
            aria-label="Next testimonial"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className={styles.dots} role="tablist" aria-label="Select testimonial">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show testimonial from ${t.name}`}
              className={`${styles.dot} ${i === active ? styles.active : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
