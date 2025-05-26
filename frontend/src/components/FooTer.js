// src/components/Footer.js
const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <p>&copy; {new Date().getFullYear()} LearnSpear. All Rights Reserved.</p>
      <div>
        <i className="fab fa-facebook mx-2"></i>
        <i className="fab fa-twitter mx-2"></i>
        <i className="fab fa-linkedin mx-2"></i>
      </div>
    </footer>
  );
};

export default Footer;
