import api from "./globalapi";

// ── Dashboard ──────────────────────────────────────────────────
export const fetchDashboard = async () => {
  const res = await api.get("/student/dashboard");
  return res.data;
};

// ── Enrolled Courses (My Courses) ──────────────────────────────
export const fetchEnrolledCourses = async () => {
  const res = await api.get("/student/enrollments");
  return res.data;
};

// ── Explore ────────────────────────────────────────────────────
export const exploreCourses = async ({ search, category, level } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (category && category !== "All") params.category = category;
  if (level && level !== "All") params.level = level;
  const res = await api.get("/student/explore", { params });
  return res.data;
};

export const fetchCourseDetail = async (courseId) => {
  const res = await api.get(`/student/explore/${courseId}`);
  return res.data;
};

// ── Lesson Progress ────────────────────────────────────────────
export const completeLesson = async ({ courseId, lessonId }) => {
  const res = await api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`);
  return res.data;
};

export const fetchCompletedLessons = async (courseId) => {
  const res = await api.get(`/student/courses/${courseId}/lessons/completed`);
  return res.data;
};

// ── Assignments ────────────────────────────────────────────────
export const fetchStudentAssignments = async () => {
  const res = await api.get("/student/assignments");
  return res.data;
};

export const submitAssignment = async ({ assignmentId, submissionText, fileUrl }) => {
  const res = await api.post(`/student/assignments/${assignmentId}/submit`, { submissionText, fileUrl });
  return res.data;
};

export const fetchMyAssignmentSubmissions = async () => {
  const res = await api.get("/student/assignments/my-submissions");
  return res.data;
};

// ── Certificates ───────────────────────────────────────────────
export const fetchCertificates = async () => {
  const res = await api.get("/student/certificates");
  return res.data;
};

// ── Reviews ────────────────────────────────────────────────────
export const postCourseReview = async ({ courseId, rating, reviewText }) => {
  const res = await api.post(`/student/courses/${courseId}/review`, { rating, reviewText });
  return res.data;
};

export const fetchCourseReviews = async (courseId) => {
  const res = await api.get(`/student/courses/${courseId}/reviews`);
  return res.data;
};

// ── Wishlist ───────────────────────────────────────────────────
export const addToWishlist = async (courseId) => {
  const res = await api.post(`/student/wishlist/${courseId}`);
  return res.data;
};

export const removeFromWishlist = async (courseId) => {
  const res = await api.delete(`/student/wishlist/${courseId}`);
  return res.data;
};

export const fetchWishlist = async () => {
  const res = await api.get("/student/wishlist");
  return res.data;
};

// ── Notes ──────────────────────────────────────────────────────
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

// ── Discussions ────────────────────────────────────────────────
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

// ── Roadmaps ───────────────────────────────────────────────────
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

// ── Projects ───────────────────────────────────────────────────
export const fetchProjects = async () => {
  const res = await api.get("/student/projects");
  return res.data;
};

export const submitProject = async ({ projectId, githubUrl, liveDemo, notes }) => {
  const res = await api.post(`/student/projects/${projectId}/submit`, {
    githubUrl, liveDemo, notes
  });
  return res.data;
};

export const fetchSubmissions = async () => {
  const res = await api.get("/student/projects/submissions");
  return res.data;
};

// ── Mentors ────────────────────────────────────────────────────
export const fetchMentors = async () => {
  const res = await api.get("/student/mentors");
  return res.data;
};

export const requestMentorSession = async (sessionRequest) => {
  const res = await api.post("/student/mentor/session/request", sessionRequest);
  return res.data;
};

// ── Notifications ──────────────────────────────────────────────
export const fetchNotifications = async () => {
  const res = await api.get("/student/notifications");
  return res.data;
};

export const markNotificationsRead = async () => {
  const res = await api.put("/student/notifications/read");
  return res.data;
};

// ── Announcements ──────────────────────────────────────────────
export const fetchAnnouncements = async () => {
  const res = await api.get("/student/announcements");
  return res.data;
};

// ── Profile ────────────────────────────────────────────────────
export const fetchProfile = async () => {
  const res = await api.get("/student/profile");
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put("/student/profile", profileData);
  return res.data;
};

// ── Payments ───────────────────────────────────────────────────
export const fetchBillingHistory = async () => {
  const res = await api.get("/student/payments/history");
  return res.data;
};

// ── Quizzes (kept for backward compat) ────────────────────────
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

// ── Checkout ───────────────────────────────────────────────────
export const validateCouponCode = async (code) => {
  const res = await api.get(`/student/coupons/validate?code=${code}`);
  return res.data;
};

export const checkoutCourse = async ({ courseId, couponCode }) => {
  const res = await api.post("/student/checkout", { courseId, couponCode });
  return res.data;
};
