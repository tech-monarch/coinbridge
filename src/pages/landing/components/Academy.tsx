import styles from "./Academy.module.css";

export default function Academy() {
  return (
    <section id="academy" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content} data-aos="fade-right">
          <p className={styles.label}>Learn. Grow. Succeed.</p>
          <h2 className={styles.heading}>Expand Your Knowledge</h2>
          <p className={styles.desc}>
            Our Academy helps you understand crypto, trading, and investing so
            you can make smarter decisions.
          </p>
          <a
            href="https://t.me/Altioda_official"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btn}
            style={{ textDecoration: "none" }}
          >
            Join Academy on Telegram →
          </a>
        </div>
        <div
          className={styles.visual}
          data-aos="fade-left"
          data-aos-delay="150"
        >
          <div className={styles.imagePlaceholder}>
            <img
              src="/crypto-academy.png"
              alt="academy"
              className={styles.img}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
