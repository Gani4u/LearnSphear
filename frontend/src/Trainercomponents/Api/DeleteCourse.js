import api from "../../Api/globalapi"

export const DeleteCourse=async(courseid)=>{
    const response=await api.delete(`/trainer/courses/delete/${courseid}`);;
    return response.data;

}