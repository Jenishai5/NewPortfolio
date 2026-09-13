import { useRef, type ReactElement } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Project } from '../data/projects';
import './ProjectCard.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PIN_ICONS = ['/pins/heart.webp', '/pins/star.webp'];
const PIN_ROTATIONS = [-9, 7];

const CONCEPT_ICONS: Record<NonNullable<Project['icon']>, ReactElement> = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="3.5" width="7" height="8.5" rx="1.2" />
      <rect x="14" y="3.5" width="7" height="5" rx="1.2" />
      <rect x="14" y="11.5" width="7" height="9" rx="1.2" />
      <rect x="3" y="15" width="7" height="5.5" rx="1.2" />
    </svg>
  ),
  rag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6 3.5h9l3 3v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" />
      <circle cx="17.5" cy="17.5" r="3" />
      <path d="m20.5 20.5 2 2" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H10l-4.5 4V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" />
      <circle cx="8.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
};

export default function ProjectCard({
  project,
  lane,
  turnAnchor,
  captionAnchor,
}: {
  project: Project;
  lane: 'a' | 'b';
  turnAnchor?: boolean;
  captionAnchor?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const pinIndex = (parseInt(project.index, 10) - 1 + PIN_ICONS.length) % PIN_ICONS.length;

  useGSAP(
    () => {
      if (!project.video) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(cardRef.current, { autoAlpha: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          cardRef.current,
          { autoAlpha: 0, y: 50, scale: 0.85, rotate: -8 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.85,
            ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: cardRef, dependencies: [project.video] },
  );

  return (
    <div
      className={`project-card project-card--${lane}${project.video ? ' project-card--reveal' : ''}${project.compact ? ' project-card--compact' : ''}${project.wide ? ' project-card--wide' : ''}`}
      data-bunny-turn-anchor={turnAnchor ? 'true' : undefined}
      data-bunny-caption-anchor={captionAnchor ? 'true' : undefined}
      ref={cardRef}
    >
      <img
        className="project-card-pin"
        src={PIN_ICONS[pinIndex]}
        alt=""
        aria-hidden="true"
        style={{ transform: `rotate(${PIN_ROTATIONS[pinIndex]}deg)` }}
      />
      <div
        className="project-card-shot"
        style={
          project.cardBg
            ? { backgroundImage: `url(${project.cardBg})` }
            : undefined
        }
      >
        {project.video ? (
          project.cardBg ? (
            <span className="project-card-shot-frame">
              <video
                src={project.video}
                poster={project.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </span>
          ) : (
            <video
              className="project-card-video"
              src={project.video}
              poster={project.poster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          )
        ) : project.image ? (
          <span className="project-card-shot-frame">
            <img src={project.image} alt={`${project.title} screenshot`} />
          </span>
        ) : project.status ? (
          <div className="project-card-concept">
            <span className="project-card-concept-icon">
              {project.icon ? CONCEPT_ICONS[project.icon] : null}
            </span>
            <span className="project-card-status-badge">{project.status}</span>
          </div>
        ) : (
          <span className="project-card-shot-label">Screenshot</span>
        )}
        <span className="project-card-index">{project.index}</span>
      </div>
      <div className="project-card-body">
        <h3>{project.title}</h3>
        <p>{project.tagline}</p>
        {project.href !== '#' ? (
          <a
            className={`project-card-visit${project.visitButtonDark ? ' project-card-visit--dark' : ''}`}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundImage: `url(${project.visitButtonImage ?? '/button-green.webp'})`,
            }}
          >
            Visit site ↗
          </a>
        ) : (
          <ul className="project-card-tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
