import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../Api/globalapi";
import { toast } from "react-toastify";


export const useAddLesson=(courseid)=>{
    const queryclient=useQueryClient();
    return useMutation({
        mutationFn:async(lessondata)=>{
            const res=await api.post(`/trainer/courses/lessons/${courseid}/create`,lessondata);
            return res.data;
        
    },
    onSuccess:()=>{
        queryclient.invalidateQueries(["lessons", courseid]);
        toast.success("Lesson added successfully! 🎉");
    },
    onError: (error) => {
        toast.error("Failed to add lesson ❌");
        
    }
    })
}