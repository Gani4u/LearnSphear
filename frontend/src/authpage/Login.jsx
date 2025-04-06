import { useState } from "react";
import {  useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useLogin } from "../Api/useLogin";
import { loginSuccess } from "../store/AuthSlice";


export const Login=()=>{
    
    const role1 = useSelector((state) => state.auth.role1); // ✅ Get role1
    const navigate=useNavigate();
    const handleclick=()=>{
        if(role1==="student"){
            navigate("/mylearning");
        }else if(role1==="teacher"){
            navigate("/myclass")
        }}

        const [formData,setFormData]=useState({
            email:"",
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
                    if(data.user.role==="student"){
                        navigate("/mylearning");
                    }else{
                        navigate("/myclass");
                    }
                }
            })

        }

    return(
        <>
        
        <button onClick={handleclick}>click me</button>   
        <h2>login</h2>
        {error&&<p style={{color:"red"}}>{error.message}</p>}
        <form onSubmit={handlesubmit}>
            <input type="email" name="email" placeholder="email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="password" onChange={handleChange} require />

            <button type="submit" disabled={isPending}>{isPending?"logggingg...":"loged in"}</button>
        </form>


        </>
    )
}