import { useState, useEffect, useRef } from 'react';
import { STATS } from '@/constants';

function CountUpNumber({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [started, end]);

  return (
    <div ref={ref} className="text-4xl lg:text-5xl font-bold text-white" >
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(26,25,83,0.4) 0%, rgba(47,47,228,0.05) 100%)'}}
      />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CountUpNumber end={parseInt(stat.value)} suffix={stat.suffix} />
              <p className="text-[#AFAFAF] mt-2 text-sm font-medium">{stat.label}</p>
              <div className="mt-3 mx-auto w-8 h-0.5 bg-[#2F2FE4] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
