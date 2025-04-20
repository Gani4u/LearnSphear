import { useSelector } from "react-redux"
import TrainerHome from "../Trainercomponents/components/TrainerHome";

export const Home=()=>{
    const user=useSelector((state)=>state.auth.user);
 
    return(
        <>
  
{user && user.role === "STUDENT" && ( 
    <>

    <p>hello student</p>
    </>)}
{user && user.role === "TRAINER" && (
    <>
    <TrainerHome />
    
    </>)}

       
        </>
    )
}