import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          full: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            gsap.set([leftRef.current, rightRef.current], { autoAlpha: 0 });
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=90%',
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
            },
          });

          tl.to(leftRef.current, { xPercent: -70, yPercent: -4, rotate: -5, ease: 'none' }, 0)
            .to(rightRef.current, { xPercent: 70, yPercent: 4, rotate: 5, ease: 'none' }, 0)
            .to('.hero-copy', { autoAlpha: 0, yPercent: -20, ease: 'none' }, 0);

          return () => tl.scrollTrigger?.kill();
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero-copy">
        <span className="hero-eyebrow">Scroll to open →</span>
        <h1>Welcome here</h1>
      </div>

      <div className="hero-half hero-half--left" ref={leftRef}>
        <div className="hero-half-inner" />
      </div>
      <div className="hero-half hero-half--right" ref={rightRef}>
        <div className="hero-half-inner" />
      </div>
    </section>
  );
}
