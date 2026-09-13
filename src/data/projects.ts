export interface Project {
  id: string;
  index: string;
  title: string;
  tagline: string;
  tags: string[];
  href: string;
  image?: string;
  cardBg?: string;
  video?: string;
  poster?: string;
  visitButtonImage?: string;
  visitButtonDark?: boolean;
  compact?: boolean;
  wide?: boolean;
  status?: string;
  icon?: 'dashboard' | 'rag' | 'chat';
}

export const projects: Project[] = [
  {
    id: 'imeet',
    index: '01',
    title: 'iMeet',
    tagline: 'Lets trainees book 1:1 mentoring sessions with volunteers in one click, synced straight to Google Calendar.',
    tags: ['React', 'FastAPI'],
    href: 'https://imeet-app.netlify.app/',
    image: '/projects/imeet.webp',
    cardBg: '/projects/card-bg-1.webp',
  },
  {
    id: 'imeet-presentation',
    index: '02',
    title: 'iMeet — Behind the Scenes',
    tagline: 'A look at how iMeet came together, presented as its own interactive webpage instead of a slide deck.',
    tags: ['Presentation', 'Web Design'],
    href: 'https://imeetpresent.netlify.app/',
    video: '/projects/video1.mp4',
    poster: '/projects/video1-poster.jpg',
    visitButtonImage: '/button.webp',
    visitButtonDark: true,
    compact: true,
  },
  {
    id: 'api-integration-project',
    index: '03',
    title: 'API Integration Project',
    tagline: 'A Game of Thrones fan site that pulls live episode data from the TVMaze API — built to practice working with a real external API.',
    tags: ['API', 'React'],
    href: 'https://gotzh.netlify.app/',
    video: '/projects/video2.mp4',
    poster: '/projects/video2-poster.jpg',
    wide: true,
    cardBg: '/projects/backgrnd2.webp',
  },
  {
    id: 'opsdesk',
    index: '04',
    title: 'OpsDesk',
    tagline: 'A lightweight operations dashboard for MSPs — client health, tickets, and automation in one place.',
    tags: ['SaaS', 'Automation'],
    href: '#',
    status: 'Building now',
    icon: 'dashboard',
  },
  {
    id: 'docmind',
    index: '05',
    title: 'DocMind',
    tagline: "Turns a company's internal docs into a searchable assistant that answers questions with cited sources.",
    tags: ['RAG', 'LLM'],
    href: '#',
    status: 'Building now',
    icon: 'rag',
  },
  {
    id: 'siteagent',
    index: '06',
    title: 'SiteAgent',
    tagline: 'An embeddable AI chat widget businesses can drop into their site to handle customer questions instantly.',
    tags: ['AI Chat', 'Widget'],
    href: '#',
    status: 'Building now',
    icon: 'chat',
  },
];
