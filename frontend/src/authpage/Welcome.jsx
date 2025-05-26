// src/pages/Welcome.js
import NavBar from "../components/NavBar";
import  { useEffect } from 'react';
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import PopularCourses from "../components/PopularCourses";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/NewsLetters";
import Footer from "../components/FooTer";

export const Welcome = () => {
  useEffect(() => {
    document.body.style.backgroundColor = '#d8d8d8'; // Desired color

    return () => {
      document.body.style.backgroundColor = ''; // Reset on unmount
    };
  }, []);
  return (
    <>
      <NavBar />
      <HeroSection />
      <Features />
      <div id="popular-courses">
      <PopularCourses />
      </div>
      <Testimonials />
      <div id="contact">
      <Newsletter />
      </div>
      <Footer />
    </>
  );
};
