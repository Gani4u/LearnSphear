import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "../store/AuthSlice";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  UserCheck,
  Search,
  LogOut,
  Sparkles,
  BookOpen
} from "lucide-react";
import {
  fetchAdminDashboard,
  approveTrainerProfile,
  toggleUserStatus
} from "../Api/adminApi";

export const AdminWorkspace = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Queries
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminDashboard,
    enabled: !!user,
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: approveTrainerProfile,
    onSuccess: () => {
      toast.success("Trainer profile approved successfully! 🎉");
      queryClient.invalidateQueries(["adminDashboard"]);
    },
    onError: (err) => {
      toast.error("Trainer approval failed: " + err.message);
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: (data) => {
      toast.success(`User status updated to ${data.approved ? "Active" : "Suspended"}`);
      queryClient.invalidateQueries(["adminDashboard"]);
    },
    onError: (err) => {
      toast.error("Status toggle failed: " + err.message);
    }
  });

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const filteredUsers = dashboardData?.allUsers?.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-500 font-bold tracking-wider">Loading Platform Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* ----------------- SIDEBAR ----------------- */}
      <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="p-6 space-y-8">
          {/* Logo banner */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-blue-500/20">
              L
            </div>
            <span className="font-extrabold text-slate-800 text-lg tracking-tight">LearnSpear</span>
            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded uppercase tracking-wider">Admin</span>
          </div>

          {/* Nav links */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block">management</span>
            <nav className="flex flex-col gap-1 pt-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "dashboard"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("approvals")}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "approvals"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} />
                  <span>Approvals</span>
                </div>
                {dashboardData?.pendingTrainersCount > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                    {dashboardData.pendingTrainersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "users"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Users size={18} />
                <span>Users Control</span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white font-extrabold text-sm">
              AD
            </div>
            <div className="text-left">
              <h4 className="font-extrabold text-xs text-slate-800">{user?.username}</h4>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Super Administrator</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-100 transition-colors"
          >
            <LogOut size={14} />
            <span>Logout Panel</span>
          </button>
        </div>
      </aside>

      {/* ----------------- MAIN VIEW ----------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        
        {/* Header banner */}
        <header className="p-6 bg-white border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Platform Administration Console</h1>
            <Sparkles size={16} className="text-blue-500 animate-pulse" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Last synced: Just now</span>
        </header>

        {/* Tab Panel contents */}
        <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8">
          
          {/* ==================== TAB: DASHBOARD ==================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Stat Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "total members", value: dashboardData?.totalUsers, icon: Users, color: "from-blue-500 to-indigo-500 shadow-blue-500/10" },
                  { label: "enrolled students", value: dashboardData?.studentCount, icon: UserCheck, color: "from-emerald-500 to-teal-500 shadow-emerald-500/10" },
                  { label: "certified trainers", value: dashboardData?.trainerCount, icon: ShieldCheck, color: "from-violet-500 to-fuchsia-500 shadow-violet-500/10" },
                  { label: "published courses", value: dashboardData?.courseCount, icon: BookOpen, color: "from-amber-500 to-orange-500 shadow-amber-500/10" }
                ].map((stat, idx) => (
                  <div key={idx} className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4 relative overflow-hidden group hover:border-slate-300 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow`}>
                        <stat.icon size={16} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action notice for pending trainers */}
              {dashboardData?.pendingTrainersCount > 0 && (
                <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-amber-800 text-sm">Pending Instructor Registrations</h4>
                    <p className="text-xs text-amber-600 font-medium">There are {dashboardData.pendingTrainersCount} trainer profiles awaiting approval. Approve them to let them publish classes.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("approvals")}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow transition-colors"
                  >
                    View Approvals List
                  </button>
                </div>
              )}

              {/* Recent Activity lists */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Users preview */}
                <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-sm">Recent Users</h3>
                    <button onClick={() => setActiveTab("users")} className="text-xs font-bold text-blue-600 hover:underline">
                      Manage All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {dashboardData?.allUsers?.slice(-4).map((user) => (
                      <div key={user.id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-extrabold text-xs text-slate-600">
                            {user.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <h4 className="font-extrabold text-xs text-slate-800">{user.username}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          user.role === "ADMIN" ? "bg-purple-50 text-purple-600" :
                          user.role === "TRAINER" ? "bg-violet-50 text-violet-600" :
                          "bg-emerald-50 text-emerald-600"
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System events dummy ledger */}
                <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-6">
                  <h3 className="font-extrabold text-slate-800 text-sm">Platform Health & Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Database Connection:</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold uppercase">Healthy</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Authentication Gate:</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold uppercase">JWT Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">API Gateway Traffic:</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold uppercase">Normal</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Environment Version:</span>
                      <span className="font-bold text-slate-800">LearnSphere v2.1-prod</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB: APPROVALS ==================== */}
          {activeTab === "approvals" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Instructor Profile Approvals</h2>
                <p className="text-sm text-slate-500">Review credential documents and profiles for trainers requesting access to publish courses.</p>
              </div>

              <div className="space-y-4">
                {dashboardData?.pendingTrainers?.map((trainer) => (
                  <div key={trainer.id} className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-base">
                        {trainer.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1 text-left">
                        <h3 className="font-extrabold text-slate-800 text-base">{trainer.username}</h3>
                        <p className="text-xs text-slate-400">{trainer.email}</p>
                        <p className="text-xs text-slate-500 pt-1 leading-relaxed max-w-md">{trainer.bio || "No bio added. Profile is ready for review."}</p>
                        {trainer.linkedin_url && (
                          <div className="flex gap-4 pt-2">
                            <a href={trainer.linkedin_url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline">
                              LinkedIn Profile
                            </a>
                            {trainer.resume_url && (
                              <a href={trainer.resume_url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline">
                                CV / Resume Document
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => approveMutation.mutate(trainer.id)}
                        disabled={approveMutation.isPending}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                      >
                        {approveMutation.isPending ? "Approving..." : "Approve Profile"}
                      </button>
                    </div>
                  </div>
                ))}

                {(!dashboardData?.pendingTrainers || dashboardData.pendingTrainers.length === 0) && (
                  <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-3xl text-sm">
                    No instructor accounts pending approval at the moment. All registered trainers are verified!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB: USERS CONTROL ==================== */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Platform Users Control</h2>
                  <p className="text-sm text-slate-500">Audit, search, and toggle authorization status for all students and trainers on LearnSpear.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72 shrink-0">
                  <Search size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search username, email, role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Table list */}
              <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-extrabold text-xs text-slate-600 uppercase">
                              {u.username.slice(0, 2)}
                            </div>
                            <div className="text-left">
                              <h4 className="font-extrabold text-slate-800 text-xs">{u.username}</h4>
                              <span className="text-[10px] text-slate-400">{u.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              u.role === "ADMIN" ? "bg-purple-50 text-purple-600" :
                              u.role === "TRAINER" ? "bg-violet-50 text-violet-600" :
                              "bg-emerald-50 text-emerald-600"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {u.approved ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                Suspended
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-[10px]">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right shrink-0">
                            {u.role !== "ADMIN" && (
                              <button
                                onClick={() => toggleStatusMutation.mutate(u.id)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                  u.approved
                                    ? "bg-red-50 hover:bg-red-100 text-red-600"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                                }`}
                              >
                                {u.approved ? "Suspend" : "Activate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}

                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-xs">
                            No users matched your query search parameters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
};
