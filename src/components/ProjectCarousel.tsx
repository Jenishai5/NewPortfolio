import { Fragment, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import SignInPreview from './SignInPreview';
import './ProjectCarousel.css';

export const VERTICAL_PROJECT_COUNT = 3;
const verticalProjects = projects.slice(0, VERTICAL_PROJECT_COUNT);

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.project-card', trackRef.current);

        cards.forEach((card, i) => {
          const speed = i % 2 === 0 ? -36 : -60;

          gsap.to(card, {
            y: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: trackRef },
  );

  return (
    <div className="carousel" ref={trackRef}>
      {verticalProjects.map((project, i) => (
        <Fragment key={project.id}>
          <ProjectCard
            project={project}
            lane={i % 2 === 0 ? 'a' : 'b'}
            turnAnchor={i === verticalProjects.length - 1}
            captionAnchor={i === 0}
          />
          {i === 0 && <SignInPreview />}
        </Fragment>
      ))}
    </div>
  );
}
