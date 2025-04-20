import React from "react";
import { Fetchcourselist } from "../Api/Fetchcourselist";
import { useQuery } from "@tanstack/react-query";

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
    <h1>hello trainer222</h1>
    <ul>
        {data?.map((course) => (
          <li key={course.id}>
            <p>ID: {course.id}</p>
            <p>Title: {course.title}</p>
            <img src={`http://localhost:8080/images/${course.imageUrl}`}
             alt="course.title"
             style={{ width: "150px", height: "auto" }}
             />
          </li>
        ))}
      </ul>


    </>)
}
export default React.memo(TrainerHome);