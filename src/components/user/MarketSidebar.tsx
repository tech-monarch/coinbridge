import React, { useEffect, useRef } from "react";
import "./MarketSidebar.css";

const MarketSidebar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // Inject the custom element into the container
    const el = document.createElement("tv-market-summary");
    el.setAttribute("time-frame", "1M");
    el.setAttribute("direction", "vertical");
    el.setAttribute("assets-type", "crypto");
    currentRef.appendChild(el);

    // Inject the TradingView script once
    const scriptId = "tv-market-summary-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "module";
      script.src =
        "https://widgets.tradingview-widget.com/w/en/tv-market-summary.js";
      document.head.appendChild(script);
    }

    return () => {
      if (currentRef) currentRef.innerHTML = "";
    };
  }, []);

  return (
    <aside className="market-sidebar">
      <div className="market-sidebar-inner">
        <p className="market-sidebar-label">Live Market</p>
        <div className="market-sidebar-widget" ref={ref} />
      </div>
    </aside>
  );
};

export default MarketSidebar;
