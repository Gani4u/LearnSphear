import { useState } from "react"
import { Popup } from "../Trainercomponents/components/Popup";
import '../Trainercomponents/styles/mycoursestyle.css'
import Courselist from "../Trainercomponents/components/Courselist";

export const Mycourse=()=>{
    const [isPopup,setIspopup]=useState(false);
    
    const popupopen=()=>setIspopup(true);
    const popupclose=()=>setIspopup(false);
    return(
        <>
        
        <div className="mycourse-wrapper">
        <div className="header-section">
          <h1>My Course</h1>
          <button className="openbtn" onClick={popupopen}>Add Course</button>
        </div>
           <Courselist/>
    
      </div>
       
        {
            isPopup &&(
                <Popup onclose={(popupclose)}>
                  <p>hello p from course</p>
                    <p>model from my course</p>
                </Popup>
            )
        }

        </>
    )
}