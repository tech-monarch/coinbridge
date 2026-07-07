import { useEffect, useRef, useState } from 'react';

/**
 * Animates a stat string like "7M+", "200+", or "24/7" by counting up the
 * leading number when the element scrolls into view, keeping any trailing
 * text (suffix) static. Falls back to rendering the raw string unchanged
 * if no leading number is found.
 */
export function useCountUp(value: string, duration = 1400) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState<string>(() => {
    const match = value.match(/^(\d+(?:\.\d+)?)/);
    return match ? `0${value.slice(match[0].length)}` : value;
  });
  const hasAnimated = useRef(false);

  useEffect(() => {
    const match = value.match(/^(\d+(?:\.\d+)?)/);
    if (!match) return; // nothing numeric to animate

    const target = parseFloat(match[1]);
    const suffix = value.slice(match[0].length);
    const isDecimal = match[1].includes('.');
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const start = performance.now();

            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              // ease-out-cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = target * eased;
              setDisplay(
                `${isDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`
              );
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return { ref, display };
}
