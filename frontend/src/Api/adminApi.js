import api from "./globalapi";

// 1. Get Admin Dashboard data
export const fetchAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

// 2. Approve Instructor/Trainer
export const approveTrainerProfile = async (id) => {
  const res = await api.post(`/admin/trainers/${id}/approve`);
  return res.data;
};

// 3. Toggle User status (Suspend / Unsuspend)
export const toggleUserStatus = async (id) => {
  const res = await api.post(`/admin/users/${id}/toggle-status`);
  return res.data;
};
