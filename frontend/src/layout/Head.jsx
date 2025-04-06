import { NavLink } from "react-router-dom"

import "../pages/csspages/headstyle.css"
import { useSelector } from "react-redux";

export const Head=()=>{
 
    
    const role1 = useSelector((state) => state.auth.role1); // ✅ Get role1
    return(
        <>
       <nav className="nav">
        <div className="para">
           
            <p>from spiders....</p>
        </div>
        <div className="topbar">
            <div className="bar"><NavLink to="home">home </NavLink></div>
            <div className="bar"><NavLink to={role1==="student"?"/mylearning":"/myclass"}>{role1==="student"?"my Learning":"my Courcess"}</NavLink></div>
            <div className="bar"><NavLink to="profile">profile</NavLink></div>
           

        </div>
        </nav>
        
        </>
    )
}