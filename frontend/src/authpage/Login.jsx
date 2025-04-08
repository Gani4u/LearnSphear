import { useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import '../pages/csspages/loginstyle.css'
import { useNavigate } from "react-router-dom";
import { useLogin } from "../Api/useLogin";
import { loginSuccess } from "../store/AuthSlice";


export const Login=()=>{
    
    
    const navigate=useNavigate();
    

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
                        navigate("/mylearning");
                    }else if(data.user.role==="TRAINER"){
                        navigate("myclass")
                    }
                }
            })

        }

    return(
        <>
        
       
        <div className="login-container">
        <h2>login</h2>

        {error&&<p style={{color:"red"}}>{error.message}</p>}
        <form className="loginform" onSubmit={handlesubmit}>
            <input type="text" name="username" placeholder="username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="password" onChange={handleChange} required />

            <button className="login-container-button" type="submit" disabled={isPending}>{isPending?"logggingg...":"loged in"}</button>
        </form>
        </div>


        </>
    )
}