import { useEffect, useState } from "react"
import { useCourseadd } from "../Api/useCourseadd";
import '../../Trainercomponents/styles/popupstyle.css'
import { CiCircleRemove } from "react-icons/ci";


export const Popup=({onclose,children})=>{
    const { mutate } = useCourseadd(); 
    const [show,setShow] =useState(false);
    const [error, setError] = useState("");
    const [popupinputdata,setPopupinputdata]=useState({
        title:"",
        description:"",
//         language:"",
//         instructorname:"",
//         video:null,
//         image:null
});
 

const handlechange=(e)=>{
    const { name, value, files } = e.target;
    if (files) {
      setPopupinputdata({ ...popupinputdata, [name]: files[0] }); // for file
    } else {
      setPopupinputdata({ ...popupinputdata, [name]: value }); // for text
    }
}
const handlesubmit=(e)=>{
      e.preventDefault();
      
  const { title, description, language,  instructorname, video, image } = popupinputdata;

  // Validation
  if (title.length < 0 || title.length > 15) {
    setError("Title must be between 4 and 15 characters.");
    return;
  }

  if (description.length < 0 || description.length > 100) {
    setError("Description must be between 50 and 100 characters.");
    return;
  }

//   if (language.length < 1 || language.length > 15) {
//     setError("Language must be between 1 and 15 characters.");
//     return;
//   }

//   if (instructorname.length < 1 ||  instructorname.length > 50) {
//     setError("Trainer name must be less than 50 characters.");
//     return;
//   }

//   if (video && video.size > 10 * 1024 * 1024) {
//     setError("Video file size should be less than 10MB.");
//     return;
//   }

//   if (image && image.size > 1024 * 1024) {
//     setError("Image file size should be less than 1MB.");
//     return;
//   }

  setError(""); // Clear errors
      
    const formData = new FormData();
    Object.entries(popupinputdata).forEach(([key, value]) => {
      formData.append(key, value);
    });
      mutate(formData,{
        onSuccess:()=>{
              alert ("course added successfully hurrye....")
            onclose();
        },
        onError: (error) => {
            console.error("Add Course Error:", error);
            alert("Failed to add course. Please try again.");
          },
      });

}
useEffect(() => {
    document.body.classList.add("popup-open");
  
    // This triggers the animation
    const timer = setTimeout(() => setShow(true), 10);
  
    // Cleanup on unmount
    return () => {
      document.body.classList.remove("popup-open");
      clearTimeout(timer);
    };
  }, []);

 return(
        <> 
         <div className={`popup-overlay ${show ? "show" : ""}`}>
        <div className="popup-container">

            <div className="cancle-button">
            <button className="button-cancle" onClick={onclose}> <CiCircleRemove  size={28}/> </button>
            </div>
            <div className="formdiv">
            <form className="forminput" onSubmit={handlesubmit}>
            <div className="form-box">

                   <input type="text" name="title" placeholder="title" value={popupinputdata.title} onChange={handlechange} required />
                    <textarea type="text" name="description" placeholder="description" value={popupinputdata.description} onChange={handlechange} required />
                    <p className={`char-count ${popupinputdata.description.length < 0 || popupinputdata.description.length > 100 ? 'invalid' : ''}`}>
                     {popupinputdata.description.length} / 100 characters </p>
{/* 
                    <input type="text" name="language" placeholder="Language" value={popupinputdata.language} onChange={handlechange} required/>
                    <input type="text" name="instructorname" placeholder="Enter Trainer Name" value={popupinputdata.instructorname} onChange={handlechange} required/>
                    <label htmlFor="video">Upload Course Video:</label>
                    <div className="file-upload">
                        <label htmlFor="video">📹 Select Course Video</label>
                           <input type="file" id="video" name="video" accept="video/*" onChange={handlechange} required />
                       </div>

                     <div className="file-upload">
                                <label htmlFor="image">🖼️ Upload Course Thumbnail Image</label>
                               <input type="file" id="image" name="image" accept="image/*" onChange={handlechange} required />
                     </div> */}
                     {error && <p className="error">{error}</p>}

                    <div className="addbutton">
                    <button type="submit">Click</button>


            </div>
            </div>
            </form>

            </div>
           
        </div>
   
        </div>

        </>
    )
}
     


