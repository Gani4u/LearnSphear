import api from "../../Api/globalapi";

export const Fetchcourselist=async()=>{
   const response=await api.get('/trainer/courses/list');
   return response.data;
};
