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
];

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

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading} data-aos="fade-up">
          What Our <span className={styles.accent}>Users Say</span>
        </h2>

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={styles.card}
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
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
                  <Stars count={t.stars} />
                </div>
              </div>
              <p className={styles.quote}>{t.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.active}`} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      </div>
    </section>
  );
}
