import { useQuery } from "@tanstack/react-query";
import { Fetchcourselist } from "../Api/Fetchcourselist";
import '../../Trainercomponents/styles/courseliststyle.css'
import { useNavigate } from "react-router-dom";


const Courselist=()=>{
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['courses'],
        queryFn: Fetchcourselist,
      });

       const navigate=useNavigate();
      const handlegotolesson=(courseid)=>{
        navigate(`/addlesson/${courseid}`);
 }
    
    
     // const courses = data || []; // ✅ fallback to empty array if data is undefined

      if (isLoading) return <p className="text-blue-500">Loading courses...</p>;
      if (isError) return <p className="text-red-500">Error: {error.message}</p>;
    return(
        <>
       <div className="course_container">
        <div className="course_list">

            {data.map((courses)=>(
                <div className="course_row" key={courses.id}>
                    <span className="value">{courses.id}</span>
                    <span className="value">{courses.title}</span>
                    <span className="value">{courses.description}</span>
                    <span><button className="delete_button" >delete</button></span>
                    <span><button onClick={() => handlegotolesson(courses.id)}>Go to Lesson</button></span>

                </div>

            ))}
        </div>
       </div>
        
        </>
    )
}
 export default Courselist;