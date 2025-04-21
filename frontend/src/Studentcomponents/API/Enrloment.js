import api from "../../Api/globalapi";

export const Enrloment=async(courseid,studentId)=>{
    console.log("course id and syudent id in api ",courseid,studentId);
    const response= await api.post(`/students/enrollments/${studentId}/courses/${courseid}/enroll`);
    return response.data
};
