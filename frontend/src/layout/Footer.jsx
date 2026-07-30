export const Footer = () => {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} LearnSpear. All rights reserved.</p>
      <div className="socials">
        <i className="fab fa-facebook" aria-label="Facebook" />
        <i className="fab fa-twitter" aria-label="Twitter" />
        <i className="fab fa-linkedin" aria-label="LinkedIn" />
      </div>
    </footer>
  );
};