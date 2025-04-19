import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fetchcourselist } from "../Api/Fetchcourselist";
import '../../Trainercomponents/styles/courseliststyle.css'
import {  useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { DeleteCourse } from "../Api/DeleteCourse";

//import '../../Trainercomponents/styles/courseliststyle.css';



 
const Courselist=()=>{
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['courses'],
        queryFn: Fetchcourselist,
        staleTime:1000*60*5,
      });
      const navigate=useNavigate();
      const queryClient = useQueryClient();

      const deleteMutation = useMutation({
        mutationFn: DeleteCourse,
        onSuccess: () => {
          toast.success("Course deleted!", {
            position: "bottom-left",
            autoClose: 2000,
            theme: "dark",
          });
          queryClient.invalidateQueries(['courses']);

        },
        onError: (error) => {
          toast.error(`Failed to delete: ${error.message}`);
        },
      });
      
   
      if (isLoading) return <p className="text-primary">Loading courses...</p>;
      if (isError) return <p className="text-danger">Error: {error.message}</p>;
   
      
      const handlegotolesson=(courseid)=>{
        navigate(`/addlesson/${courseid}`);
        console.log("courseid is", courseid);

        }
        const handleview=(courseid)=>{
           navigate(`/viewlesson/${courseid}`);
           console.log(courseid);
        }

       
        

        const handleDelete=(courseid)=>{
          const confirmDelete=window.confirm("are you sure to delete course!!?")
          if(confirmDelete){
            deleteMutation.mutate(courseid);
          }
        }


      //const courses = data || []; // ✅ fallback to empty array if data is undefined

  return (
    <div className="container my-4">
      <div className="table-responsive shadow rounded">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td className="text-center">
                 <button onClick={()=>handleDelete(course.id)} className="btn btn-sm btn-outline-danger me-2" title="Delete">
                   <i className="bi bi-trash"></i>
                 </button>
                 <button className="btn btn-sm btn-outline-primary me-2" title="Add Lesson"
                    onClick={() => handlegotolesson(course.id)} >
                <i className="bi bi-plus-circle"></i> </button>
                  <button className="btn btn-sm btn-outline-secondary" title="View"  onClick={() => handleview(course.id)} > <i className="bi bi-eye"></i>
                   </button>
               </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courselist;
