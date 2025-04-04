import { Outlet } from "react-router-dom"
import { Head } from "./Head"
import { Footer } from "./Footer"

export const Topbar=()=>{
    return(
        <>
        <Head/>
        <Outlet/>
        <Footer/>
        </>
    )

}