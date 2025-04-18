import { useQuery } from "@tanstack/react-query";
import { Fetchcourselist } from "../Api/Fetchcourselist";
import '../../Trainercomponents/styles/courseliststyle.css'
import { useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Trainercomponents/styles/courseliststyle.css';

const Courselist = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: Fetchcourselist,
  });

  if (isLoading) return <p className="text-primary">Loading courses...</p>;
  if (isError) return <p className="text-danger">Error: {error.message}</p>;
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
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash"></i> Delete
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
