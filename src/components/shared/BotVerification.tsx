import React, { useState } from "react";
import "./BotVerification.css";

interface Props {
  onVerified: (v: boolean) => void;
}

const BotVerification: React.FC<Props> = ({ onVerified }) => {
  const [state, setState] = useState<"idle" | "checking" | "done">("idle");

  const handleCheck = () => {
    if (state !== "idle") return;
    setState("checking");
    setTimeout(() => {
      setState("done");
      onVerified(true);
    }, 900);
  };

  return (
    <div className="captcha-box">
      <div className="captcha-row">
        <div
          className={`captcha-check-wrap ${state === "done" ? "checked" : ""}`}
          onClick={handleCheck}
          role="checkbox"
          aria-checked={state === "done"}
          tabIndex={0}
          onKeyDown={(e) => e.key === " " && handleCheck()}
        >
          {state === "done" && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polyline
                points="2,7 6,11 12,3"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <span className="captcha-label">I'm not a robot</span>

        {state === "checking" && (
          <div className="captcha-spinner-wrap">
            <span className="captcha-spin-ring" />
          </div>
        )}
      </div>

      {state === "done" && (
        <div className="captcha-status">Verification complete</div>
      )}

      <div className="captcha-footer">
        <span className="captcha-brand">Protected by CoinBridge</span>
        <span className="captcha-shield">🛡</span>
      </div>
    </div>
  );
};

export default BotVerification;