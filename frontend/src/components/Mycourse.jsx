import { useState } from "react"
import { Popup } from "../Trainercomponents/components/Popup";

export const Mycourse=()=>{
    const [isPopup,setIspopup]=useState(false);
    
    const popupopen=()=>setIspopup(true);
    const popupclose=()=>setIspopup(false);
    return(
        <>
        
        <h1>mY course </h1>
        <button onClick={popupopen}></button>
        

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