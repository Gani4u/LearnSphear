import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "../store/AuthSlice";
import {
  LayoutDashboard, Users, UserCheck, ShieldCheck, Search, LogOut, Sparkles, BookOpen,
  Plus, Trash2, CheckCircle, XCircle, Megaphone, DollarSign, ExternalLink, ShieldAlert,
  ArrowUpRight, Star, Tag, Layers, RefreshCw, X, Check
} from "lucide-react";
import {
  fetchAdminDashboard, fetchAllTrainers, fetchPendingTrainers, approveTrainerProfile,
  rejectTrainerProfile, toggleUserStatus, fetchAllStudents, searchUsers, fetchAdminCourses,
  adminApproveCourse, adminRejectCourse, adminFeatureCourse, adminHideCourse,
  fetchAdminAnnouncements, createAdminAnnouncement, deleteAdminAnnouncement
} from "../Api/adminApi";

export const AdminWorkspace = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [userQuery, setUserQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");

  // Announcement form state
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annType, setAnnType] = useState("GLOBAL");

  // Course rejection reason modal
  const [rejectingCourseId, setRejectingCourseId] = useState(null);
  const [courseRejectReason, setCourseRejectReason] = useState("");

  // Trainer rejection reason modal
  const [rejectingTrainerId, setRejectingTrainerId] = useState(null);
  const [trainerRejectReason, setTrainerRejectReason] = useState("");

  // Queries
  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminDashboard,
    enabled: !!user,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: fetchAdminCourses,
    enabled: activeTab === "courses" || activeTab === "dashboard",
  });

  const { data: announcements = [], isLoading: annLoading } = useQuery({
    queryKey: ["adminAnnouncements"],
    queryFn: fetchAdminAnnouncements,
    enabled: activeTab === "announcements",
  });

  const { data: searchedUsers = [] } = useQuery({
    queryKey: ["searchedUsers", userQuery],
    queryFn: () => searchUsers(userQuery),
    enabled: activeTab === "users",
  });

  // Mutations
  const approveTrainerMutation = useMutation({
    mutationFn: approveTrainerProfile,
    onSuccess: () => {
      toast.success("Trainer approved! 🎉");
      queryClient.invalidateQueries(["adminDashboard"]);
    },
    onError: (err) => toast.error("Error: " + err.message)
  });

  const rejectTrainerMutation = useMutation({
    mutationFn: rejectTrainerProfile,
    onSuccess: () => {
      toast.success("Trainer request rejected.");
      setRejectingTrainerId(null);
      setTrainerRejectReason("");
      queryClient.invalidateQueries(["adminDashboard"]);
    },
    onError: (err) => toast.error("Error: " + err.message)
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      toast.success("User approval status toggled successfully!");
      queryClient.invalidateQueries(["adminDashboard"]);
      queryClient.invalidateQueries(["searchedUsers"]);
    },
    onError: (err) => toast.error("Status toggle failed: " + err.message)
  });

  const approveCourseMutation = useMutation({
    mutationFn: adminApproveCourse,
    onSuccess: () => {
      toast.success("Course approved and published! 🚀");
      queryClient.invalidateQueries(["adminCourses"]);
    },
    onError: (err) => toast.error("Approve course failed: " + err.message)
  });

  const rejectCourseMutation = useMutation({
    mutationFn: adminRejectCourse,
    onSuccess: () => {
      toast.success("Course rejected and trainer notified.");
      setRejectingCourseId(null);
      setCourseRejectReason("");
      queryClient.invalidateQueries(["adminCourses"]);
    },
    onError: (err) => toast.error("Reject course failed: " + err.message)
  });

  const featureCourseMutation = useMutation({
    mutationFn: adminFeatureCourse,
    onSuccess: () => {
      toast.success("Course status updated to FEATURED.");
      queryClient.invalidateQueries(["adminCourses"]);
    }
  });

  const hideCourseMutation = useMutation({
    mutationFn: adminHideCourse,
    onSuccess: () => {
      toast.success("Course status updated to HIDDEN.");
      queryClient.invalidateQueries(["adminCourses"]);
    }
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: createAdminAnnouncement,
    onSuccess: () => {
      toast.success("Announcement broadcasted! 📢");
      setAnnTitle("");
      setAnnMessage("");
      queryClient.invalidateQueries(["adminAnnouncements"]);
    },
    onError: (err) => toast.error("Broadcast failed: " + err.message)
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: deleteAdminAnnouncement,
    onSuccess: () => {
      toast.success("Announcement removed.");
      queryClient.invalidateQueries(["adminAnnouncements"]);
    }
  });

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (dashLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold tracking-wider text-slate-400">Loading Platform Console...</span>
        </div>
      </div>
    );
  }

  // Filter searched users list locally if role filter is set
  const filteredUsers = searchedUsers.filter(u => {
    if (userRoleFilter === "All") return true;
    return u.role === userRoleFilter;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 flex font-sans">
      
      {/* ── SIDEBAR NAV ── */}
      <aside className="w-72 bg-[#111827] border-r border-slate-800 flex flex-col justify-between py-8 px-5 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight text-white">LearnSphear</h2>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Platform Operations</span>
            </div>
          </div>

          <div className="px-3 py-2 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Administrator</p>
              <h4 className="text-sm font-semibold text-slate-200 truncate">{user?.username}</h4>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Operations Board</span>
            </button>

            <button
              onClick={() => setActiveTab("trainers")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "trainers"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <UserCheck size={18} />
              <span>Trainer Approvals</span>
              {dashboard?.pendingTrainers?.length > 0 && (
                <span className="ml-auto bg-amber-500 text-[#0b0f19] px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                  {dashboard.pendingTrainers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Users size={18} />
              <span>User Registry</span>
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "courses"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <BookOpen size={18} />
              <span>Course Moderation</span>
            </button>

            <button
              onClick={() => setActiveTab("announcements")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "announcements"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Megaphone size={18} />
              <span>Broadcast Center</span>
            </button>
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main className="flex-1 min-w-0 flex flex-col">
        
        {/* Global Action Header */}
        <header className="h-20 bg-[#111827]/40 border-b border-slate-800 flex items-center justify-between px-8 backdrop-blur-md">
          <div className="text-lg font-bold text-white tracking-tight">
            LearnSphear Operations Control Panel
          </div>
          <div className="text-xs font-semibold text-slate-400">
            System Live status: <span className="text-emerald-400">Operational</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          
          {/* ═══════════════════════════════════════════════════════════
              DASHBOARD TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">System Statistics</h1>
                <p className="text-slate-400 text-sm mt-1">Operational summaries, student registries, and trainer lists.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{dashboard?.totalUsers || 0}</span>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Platform Accounts</p>
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center">
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{dashboard?.studentCount || 0}</span>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Total Students</p>
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{dashboard?.trainerCount || 0}</span>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Total Trainers</p>
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{dashboard?.pendingTrainersCount || 0}</span>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Pending Approvals</p>
                  </div>
                </div>
              </div>

              {/* Bottom Sections: Pending Trainer registrations */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pending Instructor Approvals</h3>
                {dashboard?.pendingTrainers?.length === 0 ? (
                  <p className="text-slate-500 text-xs">No pending trainer profile requests.</p>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {dashboard?.pendingTrainers?.map((trainer) => (
                      <div key={trainer.id} className="py-4 first:pt-0 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">{trainer.username}</h4>
                          <span className="text-xs text-slate-400 mt-1 block">{trainer.email}</span>
                          {trainer.bio && <p className="text-xs text-slate-500 mt-1.5 line-clamp-1 italic">"{trainer.bio}"</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approveTrainerMutation.mutate(trainer.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectingTrainerId(trainer.id)}
                            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TRAINER APPROVALS TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "trainers" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Trainer Profiles</h1>
                <p className="text-slate-400 text-sm mt-1">Review profiles and enable system publication capabilities.</p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Pending Requests</h3>
                {!dashboard?.pendingTrainers || dashboard.pendingTrainers.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No trainer registrations waiting for verification.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dashboard.pendingTrainers.map(trainer => (
                      <div key={trainer.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                        <div>
                          <h4 className="font-bold text-slate-200 text-sm">{trainer.username}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{trainer.email}</p>
                        </div>
                        {trainer.bio && (
                          <div className="bg-[#0b0f19]/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 italic">
                            "{trainer.bio}"
                          </div>
                        )}
                        <div className="flex gap-3">
                          <button
                            onClick={() => approveTrainerMutation.mutate(trainer.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold transition-all"
                          >
                            Approve Profile
                          </button>
                          <button
                            onClick={() => setRejectingTrainerId(trainer.id)}
                            className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-2 rounded-lg text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              USER REGISTRY TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Platform Accounts</h1>
                <p className="text-slate-400 text-sm mt-1">Suspend, view user roles, search registry and manage access controls.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative w-80">
                  <Search className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="w-full bg-[#111827] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="flex gap-2">
                  {["All", "STUDENT", "TRAINER", "ADMIN"].map(role => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        userRoleFilter === role
                          ? "bg-indigo-650 text-white"
                          : "bg-[#111827] text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* User registry Table */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/40 border-b border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="p-4">Account</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300 text-xs">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No matching accounts found.</td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-800/10">
                          <td className="p-4 font-semibold text-white">{u.username}</td>
                          <td className="p-4">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === "ADMIN" ? "bg-red-500/10 text-red-400" :
                              u.role === "TRAINER" ? "bg-violet-500/10 text-violet-400" : "bg-cyan-500/10 text-cyan-400"
                            }`}>{u.role}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.approved ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                            }`}>{u.approved ? "Active" : "Suspended"}</span>
                          </td>
                          <td className="p-4">
                            {u.role !== "ADMIN" && (
                              <button
                                onClick={() => toggleUserStatusMutation.mutate(u.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                  u.approved
                                    ? "bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                                    : "bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white"
                                }`}
                              >
                                {u.approved ? "Suspend" : "Activate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              COURSE MODERATION TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Course Quality Assurance</h1>
                <p className="text-slate-400 text-sm mt-1">Review curriculum designs, details, outlines, and publish or reject courses.</p>
              </div>

              {coursesLoading ? (
                <div className="text-center py-12"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
              ) : courses.length === 0 ? (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
                  No courses exist on the platform.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <div key={course.id} className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="h-40 bg-slate-800 relative flex items-center justify-center">
                          {course.thumbnailUrl ? (
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-violet-900/60 to-indigo-900/60 flex items-center justify-center text-slate-500">
                              <BookOpen size={44} />
                            </div>
                          )}
                          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            course.status === "PUBLISHED" ? "bg-emerald-500 text-white" :
                            course.status === "FEATURED" ? "bg-violet-600 text-white" : "bg-amber-500 text-white"
                          }`}>{course.status}</span>
                        </div>
                        <div className="p-6 space-y-3">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{course.category}</span>
                          <h3 className="text-base font-bold text-white truncate">{course.title}</h3>
                          <p className="text-slate-400 text-xs line-clamp-2">{course.description || "No description set."}</p>
                          <div className="text-[10px] text-slate-400 font-semibold space-y-1">
                            <div>Level: <span className="text-slate-300 font-normal">{course.level}</span></div>
                            <div>Price: <span className="text-slate-300 font-normal">₹{course.price}</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 border-t border-slate-800 bg-[#151c2c]/40 space-y-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveCourseMutation.mutate(course.id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectingCourseId(course.id)}
                            className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-2 rounded-lg text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => featureCourseMutation.mutate(course.id)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-lg text-[10px] font-bold transition-all"
                          >
                            Feature
                          </button>
                          <button
                            onClick={() => hideCourseMutation.mutate(course.id)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                          >
                            Hide Course
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              BROADCAST CENTER TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Platform Announcements</h1>
                <p className="text-slate-400 text-sm mt-1">Publish bulletins and notices across user categories.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Announcement form builder */}
                <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-3">New Bulletin</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block">Notice Title</label>
                    <input
                      type="text"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="e.g. Schedule Maintenance Notice"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block">Message Details</label>
                    <textarea
                      value={annMessage}
                      onChange={(e) => setAnnMessage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      rows={5}
                      placeholder="Write markdown supported announcements details..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block">Target Audience</label>
                    <select
                      value={annType}
                      onChange={(e) => setAnnType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="GLOBAL">Global (Students + Trainers)</option>
                      <option value="STUDENT">Students Only</option>
                      <option value="TRAINER">Trainers Only</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (!annTitle || !annMessage) {
                        toast.warning("Title and Message required.");
                        return;
                      }
                      createAnnouncementMutation.mutate({ title: annTitle, message: annMessage, type: annType });
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
                  >
                    Broadcast Announcement
                  </button>
                </div>

                {/* Announcement log feed */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider">Broadcast History</h3>
                  {annLoading ? (
                    <div className="text-center py-6"><div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                  ) : announcements.length === 0 ? (
                    <p className="text-slate-500 text-xs bg-[#111827] border border-slate-800 rounded-xl p-4">No platform broadcasts created.</p>
                  ) : (
                    <div className="space-y-4">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                          <div className="flex justify-between items-start border-b border-slate-800/50 pb-3 mb-3">
                            <div>
                              <h4 className="font-bold text-white text-sm">{ann.title}</h4>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">Audience: {ann.type} • Posted by {ann.createdBy}</span>
                            </div>
                            <button
                              onClick={() => deleteAnnouncementMutation.mutate(ann.id)}
                              className="text-red-400 hover:text-red-500 p-1.5 hover:bg-red-500/15 rounded-lg transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-slate-300 text-xs whitespace-pre-wrap leading-relaxed">{ann.message}</p>
                          <span className="text-[10px] text-slate-500 mt-3.5 block">{new Date(ann.createdAt).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── COURSE REJECTION REASON DIALOG MODAL ── */}
      {rejectingCourseId && (
        <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Reject Course Submission</h2>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Reason for Rejection</label>
              <textarea
                value={courseRejectReason}
                onChange={(e) => setCourseRejectReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                rows={4}
                placeholder="Include feedback on why curriculum or details do not meet standards..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingCourseId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectCourseMutation.mutate({ courseId: rejectingCourseId, reason: courseRejectReason });
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-semibold text-white"
              >
                Reject Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TRAINER REJECTION REASON DIALOG MODAL ── */}
      {rejectingTrainerId && (
        <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Reject Instructor Profile Request</h2>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Feedback Reason</label>
              <textarea
                value={trainerRejectReason}
                onChange={(e) => setTrainerRejectReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                rows={4}
                placeholder="Let trainer know why their application was rejected..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingTrainerId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectTrainerMutation.mutate({ trainerId: rejectingTrainerId, reason: trainerRejectReason });
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-semibold text-white"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminWorkspace;
