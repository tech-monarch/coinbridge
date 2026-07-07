import { useCallback, useRef } from 'react';

/**
 * Subtle "magnetic" pull toward the cursor on hover — the element nudges a
 * few pixels toward the pointer instead of staying static. Mouse-only.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.25, lift = 0) {
  const ref = useRef<T>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (e.pointerType !== 'mouse') return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      node.style.transform = `translate(${relX * strength}px, ${relY * strength - lift}px)`;
    },
    [strength, lift]
  );

  const onPointerEnter = useCallback(() => {
    const node = ref.current;
    if (!node || !lift) return;
    node.style.transform = `translateY(-${lift}px)`;
  }, [lift]);

  const onPointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = 'translate(0, 0)';
  }, []);

  return { ref, onPointerMove, onPointerEnter, onPointerLeave };
}
