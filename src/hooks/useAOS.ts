import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function useAOS(): void {
  useEffect(() => {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 70,
      delay: 0,
      anchorPlacement: 'top-bottom',
    });

    // Re-measure trigger points once images/fonts finish loading, so
    // animations don't fire at the wrong scroll position on first paint.
    const refresh = () => AOS.refreshHard();
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 400);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t);
    };
  }, []);
}
