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
            <img     src={"2e70a1dc-a680-4f63-8e1e-285aee465b38.jpg"} alt="course.title" />
          </li>
        ))}
      </ul>


    </>)
}
export default React.memo(TrainerHome);