export default function BalanceCard() {
  return (
    <div style={{ marginBottom: "32px" }}>
      <section style={{ textAlign: "center", margin: "20px 0 30px" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            margin: "0",
            letterSpacing: "-1px",
          }}
        >
          $14,205.50
        </h1>
        <p
          style={{
            color: "var(--success)",
            fontSize: "0.9rem",
            fontWeight: "600",
            margin: "8px 0 0",
          }}
        >
          + $240.10 (1.8%)
        </p>
      </section>

      <section
        style={{ display: "flex", justifyContent: "center", gap: "20px" }}
      >
        <ActionButton icon="↓" label="Receive" />
        <ActionButton icon="↑" label="Send" />
        <ActionButton icon="⇄" label="Swap" />
        <ActionButton icon="+" label="Buy" />
      </section>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          color: "var(--text-main)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: "500",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
