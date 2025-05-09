import React from "react";
import { Fetchcourselist } from "../Api/Fetchcourselist";
import { useQuery } from "@tanstack/react-query";
import '../styles/tarinerhomestyle.css'

const TrainerHome=()=>{


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['courses'],
        queryFn: Fetchcourselist,
        //staleTime:1000*60*5,
      });
      if (isLoading) return <p>Loading courses...</p>;
      if (isError) return <p>Error: {error.message}</p>;
      console.log(data);
    return(<>
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
            <button className="course-button">Buy Now</button>
          </div>
        </div>
      ))}
    </div>



    </>)
}
export default React.memo(TrainerHome);