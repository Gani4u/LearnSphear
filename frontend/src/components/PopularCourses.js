// src/components/PopularCourses.js
const PopularCourses = () => {
  const courses = [
    { title: "React for Beginners", img: "/assets/images/react.jpg", rating: 4.5 },
    { title: "Java with Spring Boot", img: "/assets/images/java+spring.png", rating: 4.7 },
    { title: "Full-Stack Development", img: "/assets/images/fullstack.jpg", rating: 4.8 },
    { title: "AI ML With Python", img: "/assets/images/aiml.jpg", rating: 4.6 },
    { title: "Become Software Developer", img: "/assets/images/software.jpg", rating: 3.8 },
    { title: "JavaScript for Beginners", img: "/assets/images/js.jpg", rating: 4.2 },
    { title: "Core Java", img: "/assets/images/java.jpg", rating: 4.4 },
    { title: "Learn Data Science", img: "/assets/images/datascience.jpg", rating: 3.9 },
    { title: "Learn Marketing", img: "/assets/images/marketing.jpg", rating: 4.8 },
  ];

  return (
    <div id="popular-courses" className="container my-5">
      <h2 className="text-center mb-4">Popular Courses</h2>
      <div className="row">
        {courses.map((course, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card mb-4 shadow-sm">
              <img
                src={course.img}
                className="card-img-top img-fluid"
                style={{ height: '200px', objectFit: 'cover' }}
                alt="course"
              />
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">Rating: {course.rating} ⭐</p>
                <a href="/login" className="btn btn-outline-primary">View Course</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCourses;
