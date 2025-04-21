import React from "react";
import { FetchAllCourse } from "../API/FetchAllCourse";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import '../../Trainercomponents/styles/tarinerhomestyle.css'
import { Enrloment } from "../API/Enrloment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const StudentHome=()=>{
  const user = useSelector((state) => state.auth.user);
  console.log("user from redux in studenthome ",user);
  const studentId = user?.id;
  console.log("student id ",studentId);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['courses'],
        queryFn: FetchAllCourse,
        //staleTime:1000*60*5,
      });
     console.log("course id in data.id ",data);
      const enrlomentMUtation = useMutation({
        mutationFn:Enrloment ,
        onSuccess: () => {
          toast.success("Enrloment successfull  you can check it in myLearning page ", {
            position: "bottom-left",
            autoClose: 2000,
            theme: "dark",
          });
          QueryClient.invalidateQueries(['courses']);

        },
        onError: (error) => {
          toast.error(`Failed to Enrole: ${error.message}`);
        },
      });
      if (isLoading) return <p>Loading courses...</p>;
      if (isError) return <p>Error: {error.message}</p>;
      console.log(data);

      const handleEnrloment=(courseId)=>{
        if (!studentId) {
          toast.error("Student not logged in");
          return;
        }
        console.log("id of 2 in handle enrloment",typeof(courseId),typeof(studentId));
        enrlomentMUtation.mutate({ courseId, studentId });

      }

    return(
        <>
        <div className="trainer_home_container">
      {data?.map((course) => (
        <div className="image_container" key={course.id}>
          <div className="card">
            <img
              src={`http://localhost:8080/images/${course.imageUrl}`}
              alt={course.title}
              className="course-image"
            />
            <h3 className="course-title">{[course.title,course.id]}</h3>
            <p className="course-description">{course.description}</p>
            <button onClick={()=>handleEnrloment(course.id)} className="course-button">Buy Now</button>
          </div>
        </div>
      ))}
    </div>

        
        </>
    )
}
export default React.memo(StudentHome);