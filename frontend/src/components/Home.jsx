import { useSelector } from "react-redux"

export const Home=()=>{
    const role1=useSelector((state)=>state.auth.role1);
    return(
        <>
       {role1==="student"&&(<div>
        <p>this is student field</p>
       </div>

       )}

       {role1==="instructor"&& (
        <div>
            <p>this is teacher field</p>
        </div>
       )}
        
        <h1>hello home page </h1>
        </>
    )
}