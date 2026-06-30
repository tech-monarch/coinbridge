import type { Step } from '@/types';
import styles from './HowItWorks.module.css';

const steps: Step[] = [
  {
    num: 1,
    title: 'Create Your Account',
    desc: 'Sign up and verify your identity in minutes — no experience required',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="12" r="5" stroke="#1e88e5" strokeWidth="2" fill="none"/>
        <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#1e88e5" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="24" cy="8" r="4" fill="#0a0e1a" stroke="#1e88e5" strokeWidth="1.5"/>
        <path d="M22 8h4M24 6v4" stroke="#1e88e5" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: 2,
    title: 'Fund Your Wallet',
    desc: 'Deposit from your bank account or retirement funds using supported payment options',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="16" rx="3" stroke="#1e88e5" strokeWidth="2" fill="none"/>
        <path d="M4 14h24" stroke="#1e88e5" strokeWidth="2"/>
        <path d="M8 20h6" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="20" r="3" fill="#1e88e5" fillOpacity="0.3" stroke="#1e88e5" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    num: 3,
    title: 'Trade & Invest',
    desc: 'Buy, sell, and manage your portfolio — including IRA investments — anytime',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 24l6-6 4 4 10-12" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12h4v4" stroke="#1e88e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="4" y="26" width="24" height="2" rx="1" fill="#1e88e5" fillOpacity="0.3"/>
      </svg>
    ),
  },
];

const Arrow = () => (
  <div className={styles.arrow}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="1.5">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  </div>
);

export default function HowItWorks() {
  return (
    <section id="exchange" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading} data-aos="fade-up">
          Start in <span className={styles.accent}>3 Easy Steps</span>
        </h2>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={step.num} className={styles.stepWrapper}>
              <div
                className={styles.step}
                data-aos="fade-up"
                data-aos-delay={i * 120}
              >
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && <Arrow />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
