import api from "./globalapi";

export const fetchEnrolledCourse=async()=>{
    const response= await api.get("/students/enrollments/list");
    return response.data;
}
