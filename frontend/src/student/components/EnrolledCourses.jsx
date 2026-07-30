import { useQuery } from "@tanstack/react-query";
import { fetchEnrolledCourse } from "../../Api/fetchEnrolledCourse";
import { useNavigate } from "react-router-dom";
import React from "react";

//import '../../Trainercomponents/styles/courseliststyle.css';



 
const Courselist=()=>{
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['courses'],
        queryFn: fetchEnrolledCourse,
      //  staleTime:1000*60*5,
      });

 React.useEffect(() => {
   if (data && !isLoading) {
     console.log("Fetched enrolled courses:", data);
   }
 }, [data, isLoading]);

const courses = data || [];


      const navigate=useNavigate();

    //   const deleteMutation = useMutation({
    //     mutationFn: DeleteCourse,
    //     onSuccess: () => {
    //       toast.success("Course deleted!", {
    //         position: "bottom-left",
    //         autoClose: 2000,
    //         theme: "dark",
    //       });
    //       queryClient.invalidateQueries(['courses']);

    //     },
    //     onError: (error) => {
    //       toast.error(`Failed to delete: ${error.message}`);
    //     },
    //   });
      
   
      if (isLoading) return <p className="text-primary">Loading courses...</p>;
      if (isError) return <p className="text-danger">Error: {error.message}</p>;
   
      
    //   const handlegotolesson=(courseid)=>{
    //     navigate(`/addlesson/${courseid}`);
    //     console.log("courseid is", courseid);

    //     }
        const handleview=(courseid)=>{
           navigate(`/course/${courseid}`);
           console.log(courseid);
        }

       
        

        // const handleDelete=(courseid)=>{
        //   const confirmDelete=window.confirm("are you sure to delete course!!?")
        //   if(confirmDelete){
        //     deleteMutation.mutate(courseid);
        //   }
        // }


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
            {courses.map((enrollment) => (

              <tr key={enrollment.id}>
                <td>{enrollment.course?.id}</td>
                <td>{enrollment.course?.title}</td>
                <td>{enrollment.course?.description}</td>
                <td className="text-center">
                 {/* <button onClick={()=>handleDelete(course.id)} clnpm startassName="btn btn-sm btn-outline-danger me-2" title="Delete">
                   <i className="bi bi-trash"></i>
                 </button> */}
                 {/* <button className="btn btn-sm btn-outline-primary me-2" title="Add Lesson"
                    onClick={() => handlegotolesson(course.id)} >
                <i className="bi bi-plus-circle"></i> </button> */}
                  <button className="btn btn-sm btn-outline-secondary" title="View"  onClick={() => handleview(enrollment.course?.id)} > <i className="bi bi-eye"></i>
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


export default React.memo(Courselist);
