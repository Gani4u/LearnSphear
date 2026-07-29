import api from "./globalapi";

// ── Dashboard ─────────────────────────────────────────────────
export const fetchAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

// ── Trainers ──────────────────────────────────────────────────
export const fetchAllTrainers = async () => {
  const res = await api.get("/admin/trainers");
  return res.data;
};

export const fetchPendingTrainers = async () => {
  const res = await api.get("/admin/trainers/pending");
  return res.data;
};

export const approveTrainerProfile = async (trainerId) => {
  const res = await api.post(`/admin/trainers/${trainerId}/approve`);
  return res.data;
};

export const rejectTrainerProfile = async ({ trainerId, reason }) => {
  const res = await api.post(`/admin/trainers/${trainerId}/reject`, { reason });
  return res.data;
};

// ── Users ─────────────────────────────────────────────────────
export const toggleUserStatus = async (userId) => {
  const res = await api.post(`/admin/users/${userId}/toggle-status`);
  return res.data;
};

export const fetchAllStudents = async () => {
  const res = await api.get("/admin/students");
  return res.data;
};

export const searchUsers = async (query) => {
  const res = await api.get("/admin/users/search", { params: { query } });
  return res.data;
};

// ── Courses ───────────────────────────────────────────────────
export const fetchAdminCourses = async () => {
  const res = await api.get("/admin/courses");
  return res.data;
};

export const adminApproveCourse = async (courseId) => {
  const res = await api.post(`/admin/courses/${courseId}/approve`);
  return res.data;
};

export const adminRejectCourse = async ({ courseId, reason }) => {
  const res = await api.post(`/admin/courses/${courseId}/reject`, { reason });
  return res.data;
};

export const adminFeatureCourse = async (courseId) => {
  const res = await api.post(`/admin/courses/${courseId}/feature`);
  return res.data;
};

export const adminHideCourse = async (courseId) => {
  const res = await api.post(`/admin/courses/${courseId}/hide`);
  return res.data;
};

// ── Announcements ─────────────────────────────────────────────
export const fetchAdminAnnouncements = async () => {
  const res = await api.get("/admin/announcements");
  return res.data;
};

export const createAdminAnnouncement = async ({ title, message, type }) => {
  const res = await api.post("/admin/announcements", { title, message, type });
  return res.data;
};

export const deleteAdminAnnouncement = async (id) => {
  const res = await api.delete(`/admin/announcements/${id}`);
  return res.data;
};
