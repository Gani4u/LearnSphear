import { useSelector } from "react-redux"

export const Home=()=>{
    const role=useSelector((state)=>state.auth.role);
    return(
        <>
       {role==="STUDENT"&&(<div>
        <p>this is student field</p>
       </div>

       )}

       {role==="TRAINER"&& (
        <div>
            <p>this is teacher field</p>
        </div>
       )}
        
        <h1>hello home page </h1>
        </>
    )
}