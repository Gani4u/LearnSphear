import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useAddLesson } from "../Api/useAddLesson";
import '../styles/addlessonstyle.css'

export const AddLesson=()=>{
    const [lessonData, setLessonData] = useState({
        title: "",
        description: "",
        duration: "", // number input
    });
     const {courseid}=useParams();
    const { mutate, isLoading } = useAddLesson(courseid);
 
   const navigate=useNavigate();

   const handleback=()=>{
    navigate(-1);
   }
   const handlesubmit=(e)=>{
    e.preventDefault();
    if (!lessonData.title || !lessonData.description || !lessonData.sequence) {
        alert("Please fill in all fields");
        return;
    }
    mutate(lessonData,{
        onSuccess:()=>{
            setLessonData({
                title: "",
                description: "",
                sequence: "",  
            
              });
        },
        onError: (error) => {
            
          },
      }); // Call the mutation to add lesson

   }
   const handleChange=(e)=>{
    const { name, value } = e.target;
    setLessonData((prevState) => ({
        ...prevState,
        [name]: value,
    }));

   }

    return(
        < div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div
        className="p-4 shadow rounded bg-light"
        style={{
          width: "100%",        // full width on mobile
          maxWidth: "400px",    // smaller max width
          minHeight: "350px",   // smaller height
          marginTop: "50px",    // vertical spacing
        }}
      >
        <h3 className="mb-4 text-center text-primary">Add Lesson for Course ID: {courseid}</h3>
        <form onSubmit={handlesubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control input-grow shadow-sm"
              name="title"
              value={lessonData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control input-grow shadow-sm"
              name="description"
              value={lessonData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Sequence</label>
            <input
              type="number"
              className="form-control input-grow shadow-sm"
              name="sequence"
              value={lessonData.sequence}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleback}
            >
              ← Go Back
            </button>
            <button
              type="submit"
              className="btn btn-primary shadow"
              disabled={isLoading}
            >
              {isLoading ? "Adding Lesson..." : "Add Lesson"}
            </button>
          </div>
        </form>
      </div>
      </div>   
       );
}