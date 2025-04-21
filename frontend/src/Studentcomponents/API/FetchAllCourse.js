import api from "../../Api/globalapi";

export const FetchAllCourse=async()=>{
    const response= await api.get("/trainer/courses/allCourses");
    return response.data;
}