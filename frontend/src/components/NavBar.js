// src/components/NavBar.js
import Carousel from 'react-bootstrap/Carousel';
import { NavLink } from 'react-router-dom';
import '../styles/styles.css';
import { HashLink } from 'react-router-hash-link';

const NavBar = () => {
  return (
    <div className="position-relative">
      {/* Carousel as Navbar background */}
      <Carousel fade indicators={false} controls={false}>
        <Carousel.Item>
          <img className="d-block w-100 vh-100 object-fit-cover" src="/assets/images/hero.JPG" alt="Slide 1" />
        </Carousel.Item>
      </Carousel>

      {/* Overlay Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark position-absolute top-0 start-0 w-100 py-3 blur-bg">
        <div className="container d-flex flex-column align-items-center gap-2">
          {/* Brand */}
          <NavLink className="navbar-brand fw-bold fs-4 text-white mb-5 mt-5" to="/">LearnSpear</NavLink>

          {/* Navigation Links */}
          <div className="d-flex flex-row gap-4 mt-5 mb-5">
            <HashLink smooth className="nav-link text-white" to="/#popular-courses">Courses</HashLink>
            <NavLink className="nav-link text-white" to="/about">About</NavLink>
            <HashLink smooth className="nav-link text-white" to="/#contact">Contact</HashLink>
          </div>

          {/* Login/Register Buttons */}
          <div className="d-flex gap-2 mb-5">
            <NavLink to="/login" className="btn btn-outline-light">Login</NavLink>
            <NavLink to="/register" className="btn btn-warning">Register</NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
