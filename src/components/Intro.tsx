import './Intro.css';

const TECH_STACK = [
  { label: 'JavaScript', icon: '/icons/js.webp' },
  { label: 'TypeScript', icon: '/icons/ts.webp' },
  { label: 'React', icon: '/icons/react.webp' },
  { label: 'Node.js', icon: '/icons/node.webp' },
  { label: 'Python', icon: '/icons/python.webp' },
  { label: 'AI / RAG', icon: '/icons/ai-rag.webp' },
  { label: 'LLM Agents', icon: '/icons/llm-agents.webp' },
  { label: 'PostgreSQL', icon: '/icons/postgres.webp' },
  { label: 'SQL', icon: '/icons/sql.webp' },
  { label: 'GitHub', icon: '/icons/github.webp' },
];

export default function Intro() {
  return (
    <div className="intro">
      <span className="intro-eyebrow">Hi, I'm</span>
      <h2 className="intro-name">Jenishai</h2>
      <p className="intro-pitch">
        A software <span className="intro-pitch-accent">developer</span> who
        likes making complicated things behave — with:
      </p>

      <div className="intro-stack">
        <ul className="intro-stack-list">
          {TECH_STACK.map((item) => (
            <li key={item.label} title={item.label}>
              <img src={item.icon} alt={item.label} className="intro-stack-icon" />
            </li>
          ))}
        </ul>
      </div>

      <a className="intro-cta" href="#contact">
        Get in touch ↓
      </a>
    </div>
  );
}
