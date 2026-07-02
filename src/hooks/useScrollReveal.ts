import { useEffect, useRef } from 'react';

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    // Observe all .reveal elements within the ref
    const reveals = element.querySelectorAll('.reveal');
    reveals.forEach((el) => observer.observe(el));

    // Also observe the element itself if it has .reveal
    if (element.classList.contains('reveal')) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

export function useCountUp(end: number, duration = 2000, start = false) {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!start || !countRef.current) return;
    const startTime = performance.now();
    const startVal = 0;

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (end - startVal) * eased);

      if (countRef.current) {
        countRef.current.textContent = current.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [end, duration, start]);

  return countRef;
}
