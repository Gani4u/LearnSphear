import api from "./globalapi";

// 1. Dashboard
export const fetchTrainerDashboard = async () => {
  const res = await api.get("/trainer/dashboard");
  return res.data;
};

// 2. Course Management
export const fetchTrainerCourses = async () => {
  const res = await api.get("/trainer/courses");
  return res.data;
};

export const createCourse = async (courseData) => {
  const res = await api.post("/trainer/courses", courseData);
  return res.data;
};

export const addLesson = async ({ courseId, lessonData }) => {
  const res = await api.post(`/trainer/courses/${courseId}/lessons`, lessonData);
  return res.data;
};

// 3. Capstone Projects
export const fetchPendingSubmissions = async () => {
  const res = await api.get("/trainer/submissions/pending");
  return res.data;
};

export const gradeSubmission = async ({ submissionId, status, feedback, rating }) => {
  const res = await api.post(`/trainer/submissions/${submissionId}/grade`, null, {
    params: { status, feedback, rating }
  });
  return res.data;
};

// 4. Appointments
export const fetchTrainerSessions = async () => {
  const res = await api.get("/trainer/sessions");
  return res.data;
};
