import { useState } from "react";
import type { FaqItem } from "@/types";
import styles from "./FAQ.module.css";

const faqs: FaqItem[] = [
  {
    question: "Is Altioda safe to use?",
    answer:
      "Yes. We use bank-level encryption and multi-factor authentication to keep your account and funds secure.",
  },
  {
    question: "Do I need experience to start?",
    answer:
      "No experience needed. Our platform is designed for beginners and professionals alike, with guided onboarding.",
  },
  {
    question: "How much do I need to start?",
    answer:
      "You can start with as little as $10. There is no minimum deposit requirement beyond what the asset requires.",
  },
  {
    question: "Can I withdraw anytime?",
    answer:
      "Yes. Withdrawals are processed within 24 hours, with most completing in under an hour.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading} data-aos="fade-up">
          Frequently Asked <span className={styles.accent}>Questions</span>
        </h2>

        <div className={styles.layout}>
          <div
            className={styles.list}
            data-aos="fade-right"
            data-aos-delay="100"
          >
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${styles.item} ${open === i ? styles.openItem : ""}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className={styles.question}>
                  <span className={styles.qText}>{faq.question}</span>
                  <span className={styles.icon}>{open === i ? "−" : "+"}</span>
                </div>
                {open === i && <p className={styles.answer}>{faq.answer}</p>}
              </div>
            ))}
          </div>

          <div
            className={styles.support}
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <div className={styles.supportIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#e3f2fd" />
                <path
                  d="M8 30v-8a16 16 0 0132 0v8"
                  stroke="#1e88e5"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M40 31a2 2 0 01-2 2h-1a2 2 0 01-2-2v-4a2 2 0 012-2h3zM10 31a2 2 0 002 2h1a2 2 0 002-2v-4a2 2 0 00-2-2h-3z"
                  stroke="#1e88e5"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <h3 className={styles.supportTitle}>Still have questions?</h3>
            <p className={styles.supportDesc}>
              Our support team is here to help.
            </p>
            <a href="#" className={styles.supportLink}>
              Contact Support &nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
