import api from "../../Api/globalapi";

export const Enrloment=async({courseId,studentId})=>{

    console.log("course id and syudent id in api ",typeof(courseId),typeof(studentId));
    const response= await api.post(`/students/enrollments/${studentId}/courses/${courseId}/enroll`);
    return response.data
};
