import { useSelector } from "react-redux"
import TrainerHome from "../trainer/components/TrainerHome";
import StudentHome from "../student/components/StudentHome";

export const Home=()=>{
    const user=useSelector((state)=>state.auth.user);
 
    return(
        <>
  
{user && user.role === "STUDENT" && ( 
    <>
     <StudentHome/>
    
    </>)}


{user && user.role === "TRAINER" && (
    <>
    <TrainerHome />
    
    </>)}

       
        </>
    )
}