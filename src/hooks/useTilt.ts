import { useCallback, useRef } from 'react';

/**
 * Adds a subtle 3D tilt + cursor-tracked glow to a card on mouse move.
 * Sets CSS custom properties (--tilt-x, --tilt-y, --glow-x, --glow-y)
 * that the component's CSS reads to drive the transform and highlight.
 * Pointer-based so it's inert on touch devices (no stuck hover states).
 */
export function useTilt<T extends HTMLElement>(strength = 8) {
  const ref = useRef<T>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (e.pointerType !== 'mouse') return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const tiltX = (py - 0.5) * -strength;
      const tiltY = (px - 0.5) * strength;

      node.style.setProperty('--tilt-x', `${tiltX}deg`);
      node.style.setProperty('--tilt-y', `${tiltY}deg`);
      node.style.setProperty('--glow-x', `${px * 100}%`);
      node.style.setProperty('--glow-y', `${py * 100}%`);
    },
    [strength]
  );

  const onPointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
