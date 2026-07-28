import React from "react";
import { useNavigate } from "react-router-dom";
import { Fetchcourselist } from "../../Api/Fetchcourselist";
import { useQuery } from "@tanstack/react-query";

const TrainerHome = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["courses"],
    queryFn: Fetchcourselist,
  });

  if (isLoading) return <p>Loading courses...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="trainer_home_container">
      {data?.map((course) => (
        <div className="image_container" key={course.id}>
          <div className="card">
            <img
              src={`http://localhost:8080/images/${course.imageUrl}`}
              alt={course.title}
              className="course-image"
            />
            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>
            <div className="course-card__actions">
              <button
                className="course-button"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                Manage
              </button>
              <button
                className="course-button btn-secondary"
                onClick={() => navigate(`/addlesson/${course.id}`)}
              >
                + Lesson
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TrainerHome);
