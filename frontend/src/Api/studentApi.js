import api from "./globalapi";

// 1. Dashboard
export const fetchDashboard = async () => {
  const res = await api.get("/student/dashboard");
  return res.data;
};

// 2. Profile
export const fetchProfile = async () => {
  const res = await api.get("/student/profile");
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put("/student/profile", profileData);
  return res.data;
};

// 3. Lesson Progress
export const completeLesson = async ({ courseId, lessonId }) => {
  const res = await api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
  return res.data;
};

export const fetchCompletedLessons = async (courseId) => {
  const res = await api.get(`/student/courses/${courseId}/lessons/completed`);
  return res.data;
};

// 4. Notes
export const fetchNotes = async (lessonId) => {
  const res = await api.get(`/student/lessons/${lessonId}/notes`);
  return res.data;
};

export const addNote = async ({ lessonId, note, timestamp }) => {
  const res = await api.post(`/student/lessons/${lessonId}/notes`, null, {
    params: { note, timestamp }
  });
  return res.data;
};

// 5. Discussion
export const fetchDiscussions = async (lessonId) => {
  const res = await api.get(`/student/lessons/${lessonId}/discussions`);
  return res.data;
};

export const addDiscussion = async ({ lessonId, message }) => {
  const res = await api.post(`/student/lessons/${lessonId}/discussions`, null, {
    params: { message }
  });
  return res.data;
};

// 6. Roadmap
export const fetchRoadmaps = async () => {
  const res = await api.get("/student/roadmaps");
  return res.data;
};

export const fetchRoadmapNodes = async (roadmapId) => {
  const res = await api.get(`/student/roadmaps/${roadmapId}/nodes`);
  return res.data;
};

export const fetchRoadmapProgress = async () => {
  const res = await api.get("/student/roadmaps/progress");
  return res.data;
};

// 7. Projects
export const fetchProjects = async () => {
  const res = await api.get("/student/projects");
  return res.data;
};

export const submitProject = async ({ projectId, githubUrl, liveDemo, notes }) => {
  const res = await api.post(`/student/projects/${projectId}/submit`, {
    githubUrl,
    liveDemo,
    notes
  });
  return res.data;
};

export const fetchSubmissions = async () => {
  const res = await api.get("/student/projects/submissions");
  return res.data;
};

// 8. Mentors
export const fetchMentors = async () => {
  const res = await api.get("/student/mentors");
  return res.data;
};

export const requestMentorSession = async (sessionRequest) => {
  const res = await api.post("/student/mentor/session/request", sessionRequest);
  return res.data;
};

// 9. Notifications
export const fetchNotifications = async () => {
  const res = await api.get("/student/notifications");
  return res.data;
};

export const markNotificationsRead = async () => {
  const res = await api.put("/student/notifications/read");
  return res.data;
};

// 10. Quizzes / Assessments
export const fetchCourseQuizzes = async (courseId) => {
  const res = await api.get(`/student/courses/${courseId}/quizzes`);
  return res.data;
};

export const fetchQuizQuestions = async (quizId) => {
  const res = await api.get(`/student/quizzes/${quizId}/questions`);
  return res.data;
};

export const submitQuizAnswers = async ({ quizId, answers }) => {
  const res = await api.post(`/student/quizzes/${quizId}/submit`, answers);
  return res.data;
};

export const fetchQuizProgress = async () => {
  const res = await api.get("/student/quizzes/progress");
  return res.data;
};

// 11. Payments & Checkouts
export const validateCouponCode = async (code) => {
  const res = await api.get(`/student/coupons/validate?code=${code}`);
  return res.data;
};

export const checkoutCourse = async ({ courseId, couponCode }) => {
  const res = await api.post("/student/checkout", { courseId, couponCode });
  return res.data;
};

export const fetchBillingHistory = async () => {
  const res = await api.get("/student/payments/history");
  return res.data;
};
