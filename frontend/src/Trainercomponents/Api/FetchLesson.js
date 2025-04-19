import api from "../../Api/globalapi";

export const FetchLesson=async(courseid)=>{
   const response=await api.get(`/trainer/courses/lessons/${courseid}/list`);
   return response.data;
};
