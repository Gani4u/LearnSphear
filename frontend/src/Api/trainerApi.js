import api from "./globalapi";

// ── Dashboard ─────────────────────────────────────────────────
export const fetchTrainerDashboard = async () => {
  const res = await api.get("/trainer/dashboard");
  return res.data;
};

// ── Courses ───────────────────────────────────────────────────
export const fetchTrainerCourses = async () => {
  const res = await api.get("/trainer/courses");
  return res.data;
};

export const createCourse = async (courseData) => {
  const res = await api.post("/trainer/courses", courseData);
  return res.data;
};

export const updateCourse = async ({ courseId, ...courseData }) => {
  const res = await api.put(`/trainer/courses/${courseId}`, courseData);
  return res.data;
};

export const deleteCourse = async (courseId) => {
  const res = await api.delete(`/trainer/courses/${courseId}`);
  return res.data;
};

export const publishCourse = async (courseId) => {
  const res = await api.post(`/trainer/courses/${courseId}/publish`);
  return res.data;
};

export const unpublishCourse = async (courseId) => {
  const res = await api.post(`/trainer/courses/${courseId}/unpublish`);
  return res.data;
};

export const archiveCourse = async (courseId) => {
  const res = await api.post(`/trainer/courses/${courseId}/archive`);
  return res.data;
};

// ── Sections ─────────────────────────────────────────────────
export const fetchSections = async (courseId) => {
  const res = await api.get(`/trainer/courses/${courseId}/sections`);
  return res.data;
};

export const addSection = async ({ courseId, title }) => {
  const res = await api.post(`/trainer/courses/${courseId}/sections`, { title });
  return res.data;
};

export const updateSection = async ({ sectionId, title }) => {
  const res = await api.put(`/trainer/sections/${sectionId}`, { title });
  return res.data;
};

export const deleteSection = async (sectionId) => {
  const res = await api.delete(`/trainer/sections/${sectionId}`);
  return res.data;
};

// ── Lessons ───────────────────────────────────────────────────
export const fetchLessons = async (courseId) => {
  const res = await api.get(`/trainer/courses/${courseId}/lessons`);
  return res.data;
};

export const addLesson = async ({ courseId, ...lessonData }) => {
  const res = await api.post(`/trainer/courses/${courseId}/lessons`, lessonData);
  return res.data;
};

export const updateLesson = async ({ lessonId, ...lessonData }) => {
  const res = await api.put(`/trainer/lessons/${lessonId}`, lessonData);
  return res.data;
};

export const deleteLesson = async (lessonId) => {
  const res = await api.delete(`/trainer/lessons/${lessonId}`);
  return res.data;
};

// ── Assignments ───────────────────────────────────────────────
export const fetchCourseAssignments = async (courseId) => {
  const res = await api.get(`/trainer/courses/${courseId}/assignments`);
  return res.data;
};

export const createAssignment = async ({ courseId, ...data }) => {
  const res = await api.post(`/trainer/courses/${courseId}/assignments`, data);
  return res.data;
};

export const updateAssignment = async ({ assignmentId, ...data }) => {
  const res = await api.put(`/trainer/assignments/${assignmentId}`, data);
  return res.data;
};

export const deleteAssignment = async (assignmentId) => {
  const res = await api.delete(`/trainer/assignments/${assignmentId}`);
  return res.data;
};

export const fetchAssignmentSubmissions = async (assignmentId) => {
  const res = await api.get(`/trainer/assignments/${assignmentId}/submissions`);
  return res.data;
};

export const gradeAssignment = async ({ submissionId, grade, feedback }) => {
  const res = await api.post(`/trainer/assignments/submissions/${submissionId}/grade`, { grade, feedback });
  return res.data;
};

// ── Projects ──────────────────────────────────────────────────
export const fetchCourseProjects = async (courseId) => {
  const res = await api.get(`/trainer/courses/${courseId}/projects`);
  return res.data;
};

export const createProject = async ({ courseId, ...data }) => {
  const res = await api.post(`/trainer/courses/${courseId}/projects`, data);
  return res.data;
};

export const updateProject = async ({ projectId, ...data }) => {
  const res = await api.put(`/trainer/projects/${projectId}`, data);
  return res.data;
};

export const deleteProject = async (projectId) => {
  const res = await api.delete(`/trainer/projects/${projectId}`);
  return res.data;
};

export const fetchPendingSubmissions = async () => {
  const res = await api.get("/trainer/submissions/pending");
  return res.data;
};

export const gradeSubmission = async ({ submissionId, status, feedback, score }) => {
  const res = await api.post(`/trainer/projects/submissions/${submissionId}/grade`, { status, feedback, score });
  return res.data;
};

// ── Student Insights ──────────────────────────────────────────
export const fetchCourseStudents = async (courseId) => {
  const res = await api.get(`/trainer/courses/${courseId}/students`);
  return res.data;
};

// ── Sessions ──────────────────────────────────────────────────
export const fetchTrainerSessions = async () => {
  const res = await api.get("/trainer/sessions");
  return res.data;
};
