import api from "../../Api/globalapi";


export const DeleteLesson=async(courseid,lessonid)=>{
    const response=await api.delete(`/trainer/courses/${courseid}/lessons/${lessonid}/delete`);
    return response.data;
};