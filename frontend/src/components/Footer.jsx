export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div>
          <h3 style={{ margin: 0, color: '#6a1b9a' }}>Identity Health Care</h3>
          <p>Modern women-focused physio, fitness, and wellbeing services.</p>
        </div>
        <div className="social-links">
          <a href="#" aria-label="Instagram">
            IG
          </a>
          <a href="#" aria-label="Facebook">
            FB
          </a>
          <a href="#" aria-label="LinkedIn">
            IN
          </a>
        </div>
      </div>
      <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--muted)' }}>
        © {new Date().getFullYear()} Identity Health Care. Designed for wellness, recovery, and confidence.
      </div>
    </footer>
  );
}
