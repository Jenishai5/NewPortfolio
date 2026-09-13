import './Footer.css';

const SOCIAL_LINKS = [
  { label: 'Gmail', href: 'mailto:jeny.janybek@gmail.com', icon: '/icons/gmail.webp' },
  { label: 'GitHub', href: 'https://github.com/Jenishai5', icon: '/icons/github.webp' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jenishai/', icon: '/icons/linkedin.webp' },
  { label: 'Reddit', href: '#', icon: '/icons/reddit.webp' },
  { label: 'Instagram', href: 'https://www.instagram.com/jenijan555/', icon: '/icons/instagram.webp' },
];

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-heading">
        <h2>
          Let's build something <span className="footer-title-accent">together</span>?
        </h2>
        <p className="footer-subtitle">Open to new opportunities — say hello below.</p>
      </div>
      <div className="footer-links">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('#') ? undefined : '_blank'}
            rel={link.href.startsWith('#') ? undefined : 'noreferrer'}
            aria-label={link.label}
            className="footer-badge"
          >
            <img src={link.icon} alt={link.label} />
          </a>
        ))}
      </div>
      <a href="#" className="footer-resume">
        Resume (PDF)
      </a>
    </footer>
  );
}
