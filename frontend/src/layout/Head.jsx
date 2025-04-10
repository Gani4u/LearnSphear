import { NavLink } from "react-router-dom"

import "../pages/csspages/headstyle.css"
import { useSelector } from "react-redux";

export const Head=()=>{
 
    
    const role = useSelector((state) => state.auth.role); // ✅ Get role1
    return(
        <>
       <nav className="nav">
        <div className="para">
           
            <p>from spiders....</p>
        </div>
        <div className="topbar">
            <div className="bar"><NavLink to="home">home </NavLink></div>
            <div className="bar"><NavLink to={role==="STUDENT"?"/mylearning":"/myclass"}>{role==="STUDENT"?"my Learning":"my Courcess"}</NavLink></div>
            <div className="bar"><NavLink to="profile">profile</NavLink></div>
           

        </div>
        </nav>
        
        </>
    )
}