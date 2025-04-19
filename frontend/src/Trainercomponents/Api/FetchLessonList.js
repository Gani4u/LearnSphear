import api from "../../Api/globalapi"

export const FetchLessonList=async(courseid)=>{
    const response=await api.get(`/trainer/courses/lessons/${courseid}/list`);
    console.log("Fetched lessons:", response.data);
    return response.data;
};