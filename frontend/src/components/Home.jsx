import { useSelector } from "react-redux"

export const Home=()=>{
    const user=useSelector((state)=>state.auth.user);
 
    return(
        <>


{user && user.role === "STUDENT" && <p>hello student</p>}
{user && user.role === "TRAINER" && <p>hello trainer</p>}

       
        </>
    )
}