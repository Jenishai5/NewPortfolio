import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './SignInPreview.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SignInPreview() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(ref.current, { autoAlpha: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          ref.current,
          { autoAlpha: 0, y: 50, scale: 0.85, rotate: -8 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotate: -3,
            duration: 0.85,
            ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div className="signin-preview" ref={ref}>
      <img src="/projects/signin.webp" alt="iMeet sign-in screen" />
    </div>
  );
}
