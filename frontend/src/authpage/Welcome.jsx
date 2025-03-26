import { NavLink } from "react-router-dom"

export const Welcome=()=>{
    return(
        <>
        <h1>hello Welcome page </h1>   
        <NavLink to="home">home</NavLink>  
        <button><NavLink to="register">Register</NavLink></button>
        <button><NavLink to="login">Login</NavLink></button>
        </>
    )
}