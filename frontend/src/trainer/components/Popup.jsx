import { useEffect, useState } from "react";
import { useCourseadd } from "../../Api/useCourseadd";
import { CiCircleRemove } from "react-icons/ci";

export const Popup = ({ onclose }) => {
  const { mutate } = useCourseadd();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [popupinputdata, setPopupinputdata] = useState({
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setShow(true), 10);

    return () => {
      document.body.style.overflow = "auto";
      clearTimeout(timer);
    };
  }, []);

  const handlechange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setPopupinputdata({ ...popupinputdata, [name]: files[0] }); // for file
    } else {
      setPopupinputdata({ ...popupinputdata, [name]: value }); // for text
    }
}
const handlesubmit=(e)=>{
      e.preventDefault();
      
  const { title, description, image } = popupinputdata;

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

  if (image && image.size > 1024 * 1024) {
    setError("Image file size should be less than 1MB.");
    return;
  }

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

 return (
    <div className={`modal-overlay ${show ? "open" : ""}`} onClick={onclose}>
      <div className={`modal ${show ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Create new course</h3>
          <button className="modal__close" onClick={onclose} aria-label="Close">
            <CiCircleRemove size={24} />
          </button>
        </div>

        <form className="auth-form" onSubmit={handlesubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={popupinputdata.title}
            onChange={handlechange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={popupinputdata.description}
            onChange={handlechange}
            required
          />
          <p className={`char-count ${
            popupinputdata.description.length < 0 || popupinputdata.description.length > 100
              ? "invalid"
              : ""
          }`}
          >
            {popupinputdata.description.length} / 100 characters
          </p>

          <div className="file-upload">
            <label htmlFor="image">🖼️ Upload course thumbnail</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handlechange}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary" type="submit">
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};
     


