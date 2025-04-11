import { useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import '../pages/csspages/loginstyle.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../Api/useLogin";
import { loginSuccess } from "../store/AuthSlice";


export const Login=()=>{
    
    
    const navigate=useNavigate();
    const location = useLocation();
    const message = location.state?.message || "";
        const [formData,setFormData]=useState({
            username:"",
            password:""
        });
        const dispatch=useDispatch();
        const {mutate,isPending,error}=useLogin();
        const handleChange=(e)=>{
            setFormData({...formData,[e.target.name]:e.target.value});
        }
        const handlesubmit=(e)=>{
            e.preventDefault();
            mutate(formData,{
                onSuccess:(data)=>{
                    dispatch(loginSuccess({user:data.user,token:data.token}));
                    if(data.user.role==="STUDENT"){
                        console.log(`lofin first ${data.user.role}`);
                        navigate("/mylearning");
                    }else if(data.user.role==="TRAINER"){
                        navigate("/myclass")
                        console.log(`lofin first ${data.user.role}`);
                        navigate("myclass")
                    }
                }
            })

        }

    return(
        <>
        
       
        <div className="login-container">
        <h2>login</h2>


        {error && <p style={{ color: "red" }}>{error.message}</p>}
        {message && <p style={{ color: "red" }}>{message}</p>}


        <form className="loginform" onSubmit={handlesubmit}>
            <input type="text" name="username" placeholder="username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="password" onChange={handleChange} required />

            <button className="login-container-button" type="submit" disabled={isPending}>{isPending?"logging...":"login"}</button>
        </form>
        </div>


        </>
    )
}