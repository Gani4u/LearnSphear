import { Outlet } from "react-router-dom"
import { Head } from "./Head"
import { Footer } from "./Footer"
import "../pages/csspages/topbarstyle.css"

export const Topbar=()=>{
    return(
        <><div className="container">
        <Head/>
        <div className="outletdiv"><Outlet/></div>
        <Footer/>
        </div>
        </>
    )

}