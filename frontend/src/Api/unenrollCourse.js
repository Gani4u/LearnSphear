import api from "./globalapi";

export const unenrollCourse = async ({ studentId, courseId }) => {
  const response = await api.delete(`/students/enrollments/${studentId}/courses/${courseId}/unenroll`);
  return response.data;
};
