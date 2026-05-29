export default function Navbar() {
  return (
    <nav
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "70px",
        backgroundColor: "var(--bg-mobile)",
        borderTop: "1px solid var(--border-color)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backdropFilter: "blur(10px)",
        zIndex: 10,
      }}
    >
      <NavIcon icon="💳" active={true} />
      <NavIcon icon="squares2x2" active={false} />
      <NavIcon icon="⇄" active={false} />
      <NavIcon icon="⚡" active={false} />
      <NavIcon icon="⚙️" active={false} />
    </nav>
  );
}

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  return (
    <div
      style={{
        fontSize: "1.4rem",
        cursor: "pointer",
        color: active ? "var(--accent)" : "var(--text-muted)",
        opacity: active ? 1 : 0.6,
        transition: "all 0.2s ease",
      }}
    >
      {icon === "squares2x2" ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ) : (
        icon
      )}
    </div>
  );
}
