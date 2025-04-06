import { useMutation } from "@tanstack/react-query"

export const useLogin=()=>{
    return useMutation({
        mutationFn:async(userdata)=>{
            const response=await fetch( URL,{
                method:"POST",
                headers:{"content-type":"application/json",

                },
                body:JSON.stringify(userdata),
            });
            if(!response.ok){
                throw new Error("login Failed...! check email and password");
            }
            return response.json();
        }
    })
}