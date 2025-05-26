import '../styles/styles.css';
import { HashLink } from 'react-router-hash-link';

const HeroSection = () => {
  return (
    <div className="hero-section position-relative text-white d-flex justify-content-center align-items-center">
      <div className="blurred-bg" style={{ backgroundImage: "url('/assets/images/computer.jpg')" }}></div>

      <div className="text-center position-relative" style={{ zIndex: 2 }}>
        <h1 className="display-4 fw-bold">Learn Anything, Anytime, Anywhere</h1>
        <p className="lead">
          Join thousands of learners upgrading their careers with LearnSpear
        </p>
        <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <HashLink smooth to="/#popular-courses">
            <button className="btn btn-primary">Browse Courses</button>
          </HashLink>

          <a href="/login">
            <button className="btn btn-outline-light">Get Started</button>
          </a>
</div>
      </div>
    </div>
  );
};

export default HeroSection;
