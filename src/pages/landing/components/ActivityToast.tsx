import { useState, useEffect, useRef } from "react";
import styles from "./ActivityToast.module.css";

// ── 30 countries (majorly European) with flag emojis ──────────────────────
const COUNTRIES = [
  { name: "Germany",        flag: "🇩🇪" },
  { name: "France",         flag: "🇫🇷" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Netherlands",    flag: "🇳🇱" },
  { name: "Spain",          flag: "🇪🇸" },
  { name: "Italy",          flag: "🇮🇹" },
  { name: "Sweden",         flag: "🇸🇪" },
  { name: "Norway",         flag: "🇳🇴" },
  { name: "Denmark",        flag: "🇩🇰" },
  { name: "Switzerland",    flag: "🇨🇭" },
  { name: "Austria",        flag: "🇦🇹" },
  { name: "Belgium",        flag: "🇧🇪" },
  { name: "Portugal",       flag: "🇵🇹" },
  { name: "Poland",         flag: "🇵🇱" },
  { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Hungary",        flag: "🇭🇺" },
  { name: "Romania",        flag: "🇷🇴" },
  { name: "Greece",         flag: "🇬🇷" },
  { name: "Finland",        flag: "🇫🇮" },
  { name: "Ireland",        flag: "🇮🇪" },
  { name: "Croatia",        flag: "🇭🇷" },
  { name: "Slovakia",       flag: "🇸🇰" },
  { name: "Bulgaria",       flag: "🇧🇬" },
  { name: "Serbia",         flag: "🇷🇸" },
  { name: "Ukraine",        flag: "🇺🇦" },
  { name: "Turkey",         flag: "🇹🇷" },
  { name: "United States",  flag: "🇺🇸" },
  { name: "Canada",         flag: "🇨🇦" },
  { name: "Australia",      flag: "🇦🇺" },
  { name: "Singapore",      flag: "🇸🇬" },
];

// ── 60 names ──────────────────────────────────────────────────────────────
const NAMES = [
  "Luca M.", "Emma S.", "Noah B.", "Olivia K.", "Elias W.",
  "Sofia D.", "Leon H.", "Mia R.", "Felix J.", "Anna P.",
  "Maximilian T.", "Laura C.", "Jonas F.", "Hannah G.", "Paul N.",
  "Marie L.", "David E.", "Julia V.", "Simon Z.", "Sara A.",
  "Thomas B.", "Elena M.", "Michael K.", "Chiara F.", "Stefan O.",
  "Ingrid L.", "Andrei P.", "Katarina S.", "Bogdan R.", "Miriam H.",
  "Pieter V.", "Amelie D.", "Christoph W.", "Ines C.", "Viktor N.",
  "Petra J.", "Marco T.", "Natalie B.", "Adrian G.", "Zoe M.",
  "Sven H.", "Clara F.", "Tobias R.", "Isabella N.", "Radu P.",
  "Freya S.", "Patrick O.", "Diana K.", "Lukas E.", "Valeria C.",
  "Henrik J.", "Alina W.", "Florian D.", "Monika T.", "Rasmus B.",
  "Vera L.", "Dominic A.", "Cecilia M.", "Artur P.", "Beatrice G.",
];

const ACTIONS = [
  { type: "deposit",  label: "deposited",  color: "#00c853", icon: "↓" },
  { type: "withdraw", label: "withdrew",   color: "#1e88e5", icon: "↑" },
  { type: "invest",   label: "invested",   color: "#ff9800", icon: "◆" },
] as const;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomAmount() {
  // steps of 500 between 1000–20000
  return (rand(2, 40) * 500).toLocaleString("en-US");
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function minutesAgo() {
  const n = rand(1, 9);
  return n === 1 ? "just now" : `${n} min ago`;
}

interface Toast {
  id: number;
  name: string;
  country: { name: string; flag: string };
  action: (typeof ACTIONS)[number];
  amount: string;
  time: string;
  visible: boolean;
}

let toastId = 0;

export default function ActivityToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const queueRef = useRef<Toast[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNext = () => {
    if (queueRef.current.length === 0) return;

    const next = queueRef.current.shift()!;

    // Make it visible
    setToasts((prev) => [...prev.slice(-2), { ...next, visible: true }]);

    // Auto-dismiss after 4.5 s
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === next.id ? { ...t, visible: false } : t))
      );
      // Remove from DOM after fade-out (400 ms)
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== next.id));
      }, 400);
    }, 4500);
  };

  const enqueue = () => {
    const toast: Toast = {
      id: ++toastId,
      name: pick(NAMES),
      country: pick(COUNTRIES),
      action: pick([...ACTIONS]),
      amount: randomAmount(),
      time: minutesAgo(),
      visible: false,
    };
    queueRef.current.push(toast);
    showNext();
  };

  useEffect(() => {
    // First popup after 3 s, then every 5–9 s
    const schedule = () => {
      const delay = rand(5000, 9000);
      timerRef.current = setTimeout(() => {
        enqueue();
        schedule();
      }, delay);
    };

    // Kick off with a short initial delay
    timerRef.current = setTimeout(() => {
      enqueue();
      schedule();
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 400);
  };

  return (
    <div className={styles.portal} aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${toast.visible ? styles.show : styles.hide}`}
        >
          {/* Left accent bar */}
          <div
            className={styles.accent}
            style={{ background: toast.action.color }}
          />

          {/* Icon bubble */}
          <div
            className={styles.iconBubble}
            style={{
              background: `${toast.action.color}18`,
              border: `1px solid ${toast.action.color}33`,
              color: toast.action.color,
            }}
          >
            {toast.action.icon}
          </div>

          {/* Text */}
          <div className={styles.body}>
            <p className={styles.main}>
              <span className={styles.nameBold}>{toast.name}</span>
              {" "}
              <span className={styles.actionWord} style={{ color: toast.action.color }}>
                {toast.action.label}
              </span>
              {" "}
              <span className={styles.amount}>${toast.amount}</span>
            </p>
            <p className={styles.meta}>
              <span className={styles.flag}>{toast.country.flag}</span>
              {toast.country.name} · {toast.time}
            </p>
          </div>

          {/* Close */}
          <button
            className={styles.close}
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
