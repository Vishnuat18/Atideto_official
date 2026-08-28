import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { PinnedServiceCard, ServiceCardShell } from './ServiceCard';
import { SERVICES, type Service } from './services-data';

const SLOT_HEIGHT_VH = 62;
const PAD = (n: number) => String(n).padStart(2, '0');

function StackedServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });

  return (
    <motion.div
      ref={ref}
      className="home-service-stack-item"
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index % 2 ? 0.06 : 0, ease: 'easeOut' }}
    >
      <ServiceCardShell service={service} active={inView} className="home-service-card--stack" />
    </motion.div>
  );
}

export default function ServicesSection() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setDesktop] = useState(() => window.matchMedia('(min-width: 900px)').matches);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    setDesktop(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setDesktop(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setActiveIndex(Math.min(SERVICES.length - 1, Math.floor(value * SERVICES.length)));
  });

  const pinned = isDesktop && !reduceMotion;

  return (
    <section className={`home-services${pinned ? '' : ' home-services--stacked'}`} aria-labelledby="services-title">
      <motion.div
        className="home-shell home-services-intro"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="home-eyebrow">Real business problems. Practical technology.</p>
        <h2 id="services-title">Technology That Solves <span>Real Business Problems.</span></h2>
        <p className="home-services-intro-text">
          From software and AI automation to cloud infrastructure and digital transformation, we build technology around the problems your business actually faces.
        </p>
      </motion.div>

      {pinned ? (
        <div
          className="home-services-track"
          ref={trackRef}
          style={{ height: `${SERVICES.length * SLOT_HEIGHT_VH}vh` }}
        >
          <div className="home-services-pin">
            <div className="home-services-grid" aria-hidden="true" />
            <div className="home-shell home-services-stage">
              <div className="home-services-cards">
                {SERVICES.map((service, index) => (
                  <PinnedServiceCard
                    key={service.number}
                    service={service}
                    index={index}
                    total={SERVICES.length}
                    active={activeIndex === index}
                    progress={scrollYProgress}
                  />
                ))}
              </div>
            </div>
            <div className="home-services-indicator" aria-hidden="true">
              <span className="home-services-counter">
                {PAD(activeIndex + 1)}
                <em> / {SERVICES.length}</em>
              </span>
              <span className="home-services-progress">
                <i style={{ width: `${((activeIndex + 1) / SERVICES.length) * 100}%` }} />
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="home-shell home-services-stack">
          {SERVICES.map((service, index) => (
            <StackedServiceCard key={service.number} service={service} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
