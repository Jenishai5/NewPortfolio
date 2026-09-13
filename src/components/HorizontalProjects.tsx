import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '../data/projects';
import { VERTICAL_PROJECT_COUNT } from './ProjectCarousel';
import ProjectCard from './ProjectCard';
import Footer from './Footer';
import './HorizontalProjects.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const horizontalProjects = projects.slice(VERTICAL_PROJECT_COUNT);

export default function HorizontalProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(gsap.utils.toArray('.project-card', trackRef.current), { autoAlpha: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        const trackLeft = track.getBoundingClientRect().left;
        const footerSlide = track.querySelector<HTMLElement>('.horizontal-projects-footer-slide');
        const syncFooterWidth = () => {
          if (footerSlide) {
            footerSlide.style.width = `${section.clientWidth}px`;
          }
        };
        const distance = () => {
          if (footerSlide) {
            const footerLeft = footerSlide.getBoundingClientRect().left;
            const sectionLeft = section.getBoundingClientRect().left;
            return Math.max(0, footerLeft - sectionLeft);
          }
          const sectionLeft = section.getBoundingClientRect().left;
          return Math.max(0, trackLeft - sectionLeft + track.scrollWidth - section.clientWidth);
        };
        const cards = gsap.utils.toArray<HTMLElement>('.project-card', track);

        syncFooterWidth();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: syncFooterWidth,
          },
        });

        tl.to(track, { x: () => -distance(), ease: 'none', duration: 1 }, 0);

        cards.forEach((card) => {
          const cardLeft = card.getBoundingClientRect().left - trackLeft;
          const d = distance() || 1;
          const width = section.clientWidth;
          const start = gsap.utils.clamp(0, 1, (cardLeft - width * 0.85) / d);
          const end = gsap.utils.clamp(0, 1, (cardLeft - width * 0.55) / d);

          tl.fromTo(
            card,
            { autoAlpha: 0, y: 40, scale: 0.92 },
            { autoAlpha: 1, y: 0, scale: 1, ease: 'power1.out', duration: Math.max(end - start, 0.01) },
            start,
          );
        });

        const introBlock = document.querySelector('.main-left');
        if (introBlock) {
          gsap.to(introBlock, {
            autoAlpha: 0,
            y: -24,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top top',
              scrub: 0.6,
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  if (horizontalProjects.length === 0) return null;

  return (
    <section className="horizontal-projects" ref={sectionRef}>
      <div className="horizontal-projects-inner">
        <div className="horizontal-projects-spacer" aria-hidden="true" />
        <div className="horizontal-projects-track" ref={trackRef}>
          {horizontalProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} lane={i % 2 === 0 ? 'a' : 'b'} />
          ))}
          <div className="horizontal-projects-footer-slide">
            <Footer />
          </div>
        </div>
      </div>
    </section>
  );
}
