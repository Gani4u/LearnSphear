import api from "./globalapi";

export const fetchCourseDetails = async (courseId) => {
  const response = await api.get(`/trainer/courses/${courseId}`);
  return response.data;
};
