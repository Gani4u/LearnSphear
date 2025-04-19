import { NavLink } from "react-router-dom"
import '../pages/csspages/welcomestyle.css'

export const Welcome=()=>{
    return(
        <>
         
        <div className="welcome-container">
        <h1>hello Welcome page </h1>   
        
        <div className="welcome-button-container">
        <NavLink to="register">
            <button className="welcome-button">Register</button>
          </NavLink>
          <NavLink to="login">
            <button className="welcome-button">Login</button>
          </NavLink>
        </div>
        </div>
        </>
    )
}