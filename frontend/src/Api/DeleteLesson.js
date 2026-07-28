import api from "./globalapi";


export const DeleteLesson=async(courseid,lessonid)=>{
   // const response=await api.delete(`/trainer/courses/${courseid}/lessons/${lessonid}/delete`);
    const response=await api.delete(`/trainer/courses/lessons/${courseid}/lessons/${lessonid}/delete`);
    return response.data;
};
// /trainer/courses/lessons/{courseId}/lessons/{lessonId}/delete
