import { useState } from "react";
import type { FaqItem } from "@/types";
import styles from "./FAQ.module.css";

const faqs: FaqItem[] = [
  {
    question: "Is Altioda safe to use?",
    answer:
      "Yes. We use bank-level encryption and multi-factor authentication. Cash balances are FDIC-insured up to $250,000 through our banking partners, digital assets are held with Coinbase, and we carry both cyber liability and crime insurance for added protection.",
  },
  {
    question: "Can I invest my IRA through Altioda?",
    answer:
      "Yes. Altioda acts as a licensed IRA custodian, letting you invest Traditional, Roth, and SEP IRA funds in over 200 cryptocurrencies while preserving the associated tax advantages. We recommend reviewing your IRA eligibility before getting started.",
  },
  {
    question: "What fees does Altioda charge?",
    answer:
      "We believe in transparent pricing: a 1% trading fee on cryptocurrency transactions, with low or no monthly maintenance fees. There are no hidden charges.",
  },
  {
    question: "Do I need experience to start?",
    answer:
      "No experience needed. Our platform is designed for beginners and professionals alike, with guided onboarding and Academy resources to help along the way.",
  },
  {
    question: "How much do I need to start?",
    answer:
      "You can start with as little as $10. There's no platform minimum beyond what a specific asset requires. As with any investment, only commit funds you're comfortable putting at risk.",
  },
  {
    question: "Can I withdraw anytime?",
    answer:
      "Yes, for standard accounts. Withdrawals are processed within 24 hours, with most completing in under an hour. IRA accounts follow standard IRS early-withdrawal rules — our support team can walk you through the details.",
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
              Our support team is available 24/7 — reach us on WhatsApp or
              Telegram and we'll get back to you right away.
            </p>
            <div className={styles.contactBtns}>
              <a
                href="https://wa.me/12022000794"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.contactBtn} ${styles.waBtn}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.345.101 11.925c0 2.101.549 4.153 1.595 5.963L0 24l6.335-1.652c1.746.943 3.71 1.442 5.71 1.443h.005c6.585 0 11.946-5.344 11.949-11.924.001-3.181-1.237-6.169-3.479-8.418z" />
                </svg>
                Chat on WhatsApp
              </a>
              <a
                href="https://t.me/Altioda"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.contactBtn} ${styles.tgBtn}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Message on Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
