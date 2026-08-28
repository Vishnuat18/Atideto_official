import { BlurFade } from '@/components/ui/blur-fade';
import { Marquee } from '@/components/ui/marquee';
import { ArrowRight } from 'lucide-react';

// Import all tech stack logos
import aws from '@/assets/new stack/aws.png';
import csharp from '@/assets/new stack/csharp.png';
import figma from '@/assets/new stack/figma.png';
import java from '@/assets/new stack/java.png';
import javascript from '@/assets/new stack/javascript.svg';
import mongodb from '@/assets/new stack/mongodb.png';
import mysql from '@/assets/new stack/mysql.png';
import nextjs from '@/assets/new stack/nextjs.png';
import nodejs from '@/assets/new stack/nodejs.png';
import postgres from '@/assets/new stack/postgres.png';
import python from '@/assets/new stack/python.png';
import react from '@/assets/new stack/react.png';
import tailwind from '@/assets/new stack/tailwind.png';
import typescript from '@/assets/new stack/typescript.png';
import eex from '@/assets/new stack/docker.svg';

interface TechLogo {
  src: string;
  name: string;
}

// Tape 1 — moves left (Marquee default direction)
const ROW1_LOGOS: TechLogo[] = [
  { src: react, name: 'React' },
  { src: nextjs, name: 'Next.js' },
  { src: typescript, name: 'TypeScript' },
  { src: nodejs, name: 'Node.js' },
  { src: python, name: 'Python' },
  { src: mysql, name: 'MySQL' },
  { src: aws, name: 'AWS' },
  { src: eex, name: 'Docker' },
];

// Tape 2 — moves rightwards (reverse)
const ROW2_LOGOS: TechLogo[] = [
  { src: tailwind, name: 'Tailwind' },
  { src: javascript, name: 'JavaScript' },
  { src: java, name: 'Java' },
  { src: mongodb, name: 'MongoDB' },
  { src: postgres, name: 'PostgreSQL' },
  { src: figma, name: 'Figma' },
  { src: csharp, name: 'C#' },
];

function TechTile({ logo }: { logo: TechLogo }) {
  let scale = 1;
  const name = logo.name.toLowerCase();
  
  if (name.includes('javascript') || name.includes('docker')) {
    scale = 0.85;
  } else if (name.includes('mongodb')) {
    scale = 1.15;
  } else if (name.includes('tailwind')) {
    scale = 1.35;
  } else if (name.includes('next.js')) {
    scale = 1.1;
  }

  return (
    <div className="about-tech-tile" title={logo.name}>
      <div className="about-tech-wrapper" style={{ transform: `scale(${scale})` }}>
        <img src={logo.src} alt={logo.name} />
        <div 
          className="about-tech-logo-mask" 
          style={{ 
            WebkitMaskImage: `url(${logo.src})`, 
            maskImage: `url(${logo.src})` 
          }} 
        />
      </div>
    </div>
  );
}

export default function TechStack() {
  return (
    <section id="technology" className="relative py-20 md:py-28 overflow-hidden">
      <div className="mx-auto w-full max-w-[1360px] px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-12 lg:gap-14 items-center">
          {/* Left — static content zone */}
          <div className="relative z-20 flex flex-col items-start">
            <BlurFade delay={0} inView>
              <span className="about-eyebrow">Our Technology ✦ Innovation</span>
            </BlurFade>

            <BlurFade delay={0.1} inView>
              <h2 className="about-section-title mb-6">
                Built With Modern.
                <br />
                Powered By{' '}
                <span className="about-heading-grad">
                  Innovation.
                </span>
              </h2>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <p className="max-w-md text-[var(--about-muted)] text-base leading-relaxed mb-8">
                We build secure, scalable and future-ready digital solutions using carefully selected
                technologies — engineered as one continuous system, not a collection of tools.
              </p>
            </BlurFade>

            <BlurFade delay={0.3} inView>
              <a
                href="#technology"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--about-primary)] transition-colors hover:text-[var(--about-cyan)]"
              >
                View Engineering Stack
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </BlurFade>
          </div>

          {/* Right — technology motion zone */}
          <div className="relative z-10 about-tech-tapes">
            {/* Tape 1 — moves left */}
            <Marquee className="[--duration:30s] [--gap:1.25rem] mb-9">
              {ROW1_LOGOS.map((logo) => (
                <TechTile key={logo.name} logo={logo} />
              ))}
            </Marquee>

            {/* Tape 2 — moves right, same speed */}
            <Marquee reverse className="[--duration:30s] [--gap:1.25rem]">
              {ROW2_LOGOS.map((logo) => (
                <TechTile key={logo.name} logo={logo} />
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}
