import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { FetchLessonList } from "../Api/FetchLessonList";
import { DeleteLesson } from "../Api/DeleteLesson";
import { toast } from "react-toastify";

export const ViewLesson=()=>{
 const {courseid}=useParams();
 const navigate=useNavigate();
 const queryclient=useQueryClient();
 const{ data:lessons,isLoading,isError,error}=useQuery({
    queryKey:['lesson',courseid],
    queryFn:()=>FetchLessonList(courseid),
        enabled: !!courseid,
    
 })

 const deleteLessonMutation=useMutation({
  mutationFn:({courseid,lessonid})=>DeleteLesson(courseid,lessonid),
  onSuccess:()=>{
    toast.success("lesson deleted successful");
    queryclient.invalidateQueries(['lesson',courseid]);

  },
onError:(error)=>{
  toast.error("failed to delete lesson ");
},

 });
 if (isLoading) return <p>Loading lessons...</p>;
if (isError) return <p>Error: {error.message}</p>;
 
    const handleback=()=>{
     navigate(-1);
    }
     
    const handleDeleteLesson=(lessonid)=>{
       const confirmDelete=window.confirm("are you sure to delete lesson!!! ");
       if(confirmDelete){
            deleteLessonMutation.mutate({courseid,lessonid});

       }

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
                    <td>{lesson.description || 'No description available ok'}</td>
                    <td>{lesson.sequence || 'No sequence available'}</td>
                    <td>
                          <button onClick={()=>handleDeleteLesson(lesson.id)}
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