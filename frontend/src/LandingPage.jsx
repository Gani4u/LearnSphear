import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Login } from "./authpage/Login";
import { Registerpage } from "./authpage/Registerpage";

const AuthModal = ({ mode, onClose, onModeChange }) => {
  const showLogin = mode === "login";

  const title = useMemo(() => {
    if (mode === "register") return "Create your account";
    return "Welcome back";
  }, [mode]);

  useEffect(() => {
    if (!mode) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mode]);

  if (!mode) return null;

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className={`ls-modal-overlay ${mode ? "open" : ""}`} onClick={handleClose}>
      <div className={`ls-modal ${mode ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="ls-modal__header">
          <div>
            <h2 className="ls-modal__title">{title}</h2>
            <p className="text-muted" style={{ margin: 0 }}>
              {showLogin
                ? "Enter your credentials to continue."
                : "Create an account to start learning right away."}
            </p>
          </div>
          <button className="ls-modal__close" onClick={handleClose} aria-label="Close modal">
            ×
          </button>
        </div>

        {showLogin ? (
          <Login onSuccess={handleClose} onSwitch={() => onModeChange && onModeChange("register")} />
        ) : (
          <Registerpage onSuccess={handleClose} onSwitch={() => onModeChange && onModeChange("login")} />
        )}
      </div>
    </div>
  );
};

const landingFeatures = [
  { icon: "fa-solid fa-chalkboard-user", title: "Expert Instructors" },
  { icon: "fa-solid fa-clock", title: "Flexible Schedule" },
  { icon: "fa-solid fa-certificate", title: "Certifications" },
  { icon: "fa-solid fa-laptop-code", title: "Hands-on Projects" },
  { icon: "fa-solid fa-briefcase", title: "Career Guidance" },
  { icon: "fa-solid fa-wallet", title: "Affordable Pricing" },
  { icon: "fa-solid fa-infinity", title: "Lifetime Access" },
  { icon: "fa-solid fa-question-circle", title: "Interactive Quizzes" },
];

const landingCourses = [
  {
    title: "React for Beginners",
    img: "https://picsum.photos/seed/react/600/360",
    rating: 4.5,
  },
  {
    title: "Java with Spring Boot",
    img: "https://picsum.photos/seed/java/600/360",
    rating: 4.7,
  },
  {
    title: "Full‑Stack Development",
    img: "https://picsum.photos/seed/fullstack/600/360",
    rating: 4.8,
  },
  {
    title: "AI & ML with Python",
    img: "https://picsum.photos/seed/aiml/600/360",
    rating: 4.6,
  },
];

const testimonials = [
  {
    name: "Asha",
    comment: "This platform helped me get a job after college!",
  },
  {
    name: "Kiran",
    comment: "The courses here made learning easy and job-ready.",
  },
  {
    name: "Bhuvan",
    comment: "I transitioned from beginner to professional with the mentorship here.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState(null);

  useEffect(() => {
    document.title = "LearnSpear · Learn Anything";
  }, []);

  useEffect(() => {
    const path = location.pathname.toLowerCase().replace(/\/+$/, "");
    if (path === "/login") {
      setAuthMode("login");
    } else if (path === "/register") {
      setAuthMode("register");
    } else {
      setAuthMode(null);
    }
  }, [location.pathname]);

  const openAuth = (mode) => {
    setAuthMode(mode);
  };

  const closeAuth = () => {
    setAuthMode(null);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header className="site-nav">
        <div className="brand">LearnSpear</div>
        <div className="nav-links">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => scrollToSection("popular-courses")}
          >
            Courses
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => scrollToSection("testimonials")}
          >
            Testimonials
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => openAuth("login")}
          >
            Login
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openAuth("register")}
          >
            Register
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero__content">
            <h1>Train for tomorrow’s jobs, today.</h1>
            <p>
              LearnSpear brings industry-led courses, personalized coaching, and hands-on
              projects together in one modern learning experience.
            </p>
            <div className="hero__actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => scrollToSection("popular-courses")}
              >
                Browse Courses
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openAuth("register")}
              >
                Get Started
              </button>
            </div>
          </div>
        </section>

        <section className="section section--compact">
          <div className="container">
            <h2 className="text-center mb-2">Why LearnSpear?</h2>
            <div className="section--cards">
              {landingFeatures.map((item) => (
                <div key={item.title} className="feature-card glass">
                  <i className={item.icon} aria-hidden="true" />
                  <h5>{item.title}</h5>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="popular-courses" className="section">
          <div className="container">
            <h2 className="text-center mb-2">Popular Courses</h2>
            <div className="popular-grid">
              {landingCourses.map((course) => (
                <div className="popular-card" key={course.title}>
                  <div className="card__header">
                    <img src={course.img} alt={course.title} />
                  </div>
                  <div className="popular-card__body">
                    <h5 className="card__title">{course.title}</h5>
                    <p className="card__text">Rating: {course.rating} ⭐</p>
                    <div className="popular-card__footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => openAuth("login")}
                      >
                        View Course
                      </button>
                      <span className="text-muted">Starts at ₹499</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="section">
          <div className="container">
            <h2 className="text-center mb-2">What Learners Say</h2>
            <div className="popular-grid">
              {testimonials.map((t) => (
                <div className="testimonial glass" key={t.name}>
                  <p>“{t.comment}”</p>
                  <h6>- {t.name}</h6>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <div className="flex-center" style={{ flexDirection: "column", gap: "1.5rem" }}>
              <h2 className="text-center">Stay in the loop</h2>
              <p className="text-center mb-2">
                Subscribe for updates, discounts, and new course drops.
              </p>
              <form
                className="d-flex justify-content-center"
                style={{ gap: "1rem", flexWrap: "wrap", maxWidth: "740px" }}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-control"
                  required
                  style={{ minWidth: "280px" }}
                />
                <button className="btn btn-primary" type="submit">
                  Subscribe
                </button>
              </form>
              <div style={{ maxWidth: "760px", width: "100%" }}>
                <h3 className="mb-1">Have a question?</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thanks for reaching out! We'll get back to you shortly.");
                  }}
                  className="d-flex flex-column"
                  style={{ gap: "1rem" }}
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    className="form-control"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    className="form-control"
                    required
                  />
                  <textarea
                    rows={4}
                    placeholder="Your message"
                    className="form-control"
                    required
                  />
                  <button className="btn btn-secondary" type="submit">
                    Send message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} LearnSpear. All rights reserved.</p>
        <div className="socials">
          <i className="fab fa-facebook" aria-label="Facebook" />
          <i className="fab fa-twitter" aria-label="Twitter" />
          <i className="fab fa-linkedin" aria-label="LinkedIn" />
        </div>
      </footer>

      <AuthModal mode={authMode} onClose={closeAuth} onModeChange={(mode) => openAuth(mode)} />
    </>
  );
}
