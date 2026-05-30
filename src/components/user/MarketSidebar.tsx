import React, { useEffect, useRef } from "react";
import "./MarketSidebar.css";

const MarketSidebar: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = container.current;
    if (!currentRef) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `{
      "displayMode": "regular",
      "feedMode": "all_symbols",
      "colorTheme": "dark",
      "isTransparent": false,
      "locale": "en",
      "width": "100%",
      "height": "100%"
    }`;
    currentRef.appendChild(script);

    return () => {
      if (currentRef) currentRef.innerHTML = "";
    };
  }, []);

  return (
    <aside className="market-sidebar">
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </aside>
  );
};

export default MarketSidebar;