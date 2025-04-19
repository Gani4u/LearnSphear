import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { FetchLessonList } from "../Api/FetchLessonList";

export const ViewLesson=()=>{
 const {courseid}=useParams();
 const navigate=useNavigate();
 const{ data:lessons,isLoading,isError,error}=useQuery({
    queryKey:['lesson',courseid],
    queryFn:()=>FetchLessonList(courseid),
        enabled: !!courseid,
    
 })
 if (isLoading) return <p>Loading lessons...</p>;
if (isError) return <p>Error: {error.message}</p>;
 
    const handleback=()=>{
     navigate(-1);
    }
 
    return (
        <div className="container my-4">
          <h3 className="mb-4">Course View of Course ID: {courseid}</h3>
          <button className="btn btn-outline-secondary mb-3" onClick={handleback}>
            Go Back
          </button>
    
          <div className="table-responsive shadow rounded">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Course ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Sequence</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons?.map((lesson) => (
                  <tr key={lesson.id}>
                    <td>{courseid || 'No course ID available'}</td>
                    <td>{lesson.title || 'No title available'}</td>
                    <td>{lesson.description || 'No description available'}</td>
                    <td>{lesson.sequence || 'No sequence available'}</td>
                    <td>
                          <button
                           className="btn btn-danger btn-sm" >
                              <i className="bi bi-trash"></i> {/* Bootstrap trash icon */} </button>
                              </td>

                  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
}