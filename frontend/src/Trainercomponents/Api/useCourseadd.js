import { useMutation } from "@tanstack/react-query"

import { useSelector, useDispatch } from "react-redux"; // ✅

import axios from "axios";

export const useCourseadd=()=>{
    const token=useSelector((state=>state.auth.token))
    console.log(`this is token ${token}`)
    
    const URL = "http://localhost:8080/trainer/courses/create";
    ;
    return useMutation({
        mutationFn:async(coursedata)=>{
            const response=await axios.post(URL,coursedata,{

                headers: {
                    Authorization: `Bearer ${token}`,
                    //"Content-Type": "application/json"
                  }
                  
            });
            return response.data;
        },
        
    });
}