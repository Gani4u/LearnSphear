// src/components/Features.js
const Features = () => {
  const data = [
    { icon: "fa-solid fa-chalkboard-user", title: "Expert Instructors" },
  { icon: "fa-solid fa-clock", title: "Flexible Schedule" },
  { icon: "fa-solid fa-certificate", title: "Certifications" },
  { icon: "fa-solid fa-laptop-code", title: "Hands-on Projects" },
  { icon: "fa-solid fa-briefcase", title: "Career Guidance" },
  { icon: "fa-solid fa-wallet", title: "Affordable Pricing" },
  { icon: "fa-solid fa-infinity", title: "Lifetime Access" },
  { icon: "fa-solid fa-question-circle", title: "Interactive Quizzes" },
  { icon: "fa-solid fa-users", title: "Community Support" },
  { icon: "fa-solid fa-network-wired", title: "Real-world Scenarios" },
  { icon: "fa-solid fa-chart-line", title: "Progress Tracking" },
  { icon: "fa-solid fa-file-download", title: "Downloadable Resources" },
  { icon: "fa-solid fa-user-graduate", title: "One-on-One Mentorship" },
  { icon: "fa-solid fa-mobile-screen", title: "Mobile Friendly" },
  { icon: "fa-solid fa-rotate", title: "Regular Updates" },
  { icon: "fa-solid fa-map", title: "Custom Learning Paths" },
  { icon: "fa-solid fa-language", title: "Language Support" },
  { icon: "fa-solid fa-comments", title: "Doubt Clearing Sessions" },
  ];

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Why LearnSpear?</h2>
      <div className="row text-center">
        {data.map((item, idx) => (
          <div className="col-md-4" key={idx}>
            <i className={`${item.icon} fa-3x mb-3 text-primary`}></i>
            <h5>{item.title}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
