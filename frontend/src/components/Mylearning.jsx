import { useState } from "react";
import { Popup } from "../Trainercomponents/components/Popup";
import Courselist from "../Studentcomponents/components/EnrolledCourses";

export const Mylearning=()=>{
    const [isPopup,setIspopup]=useState(false);
    
    const popupclose=()=>setIspopup(false);
    return(
        <>
        
        <div className="mycourse-wrapper">
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