// src/components/Testimonials.js
const Testimonials = () => {
  const testimonials = [
    {
      name: "Asha",
      comment: "This platform helped me get a job after college!",
    },
    {
      name: "Ravi",
      comment: "Courses are well-structured and easy to follow.",
    },
    {
      name: "Kiran",
      comment: "This site gave me the skills and confidence to crack my dream job.",
    },
    {
      name: "Kushal",
      comment: "I built my portfolio here and got noticed by recruiters.",
    },
    {
      name: "Yadav",
      comment: "The courses here made learning easy and job-ready",
    },
    {
      name: "Bhuvan",
      comment: "I transitioned from a beginner to a full-time developer with this platform’s help.",
    },
    {
      name: "Guru",
      comment: "The hands-on projects here helped me stand out in interviews",
    },
    {
      name: "Praveen",
      comment: "After completing a few courses, I finally secured a role in a top company.",
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">What Learners Say</h2>
      <div className="row">
        {testimonials.map((t, idx) => (
          <div className="col-md-6" key={idx}>
            <div className="p-4 border rounded mb-3 shadow-sm bg-light">
              <p>"{t.comment}"</p>
              <h6 className="text-end">- {t.name}</h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
