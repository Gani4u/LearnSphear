import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  BookOpen,
  Milestone,
  FolderGit,
  User,
  Bell,
  Flame,
  Calendar,
  Award,
  TrendingUp,
  Settings,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  Clock,
  GitBranch,
  Play,
  Sparkles,
  ClipboardList
} from "lucide-react";
import {
  fetchDashboard,
  fetchProfile,
  updateProfile,
  fetchRoadmaps,
  fetchRoadmapNodes,
  fetchRoadmapProgress,
  fetchProjects,
  submitProject,
  fetchSubmissions,
  fetchMentors,
  requestMentorSession,
  fetchNotifications,
  markNotificationsRead,
  fetchCourseQuizzes,
  fetchQuizQuestions,
  submitQuizAnswers,
  fetchQuizProgress,
  fetchBillingHistory
} from "../Api/studentApi";
import { fetchEnrolledCourse } from "../Api/fetchEnrolledCourse";

export const Mylearning = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Quiz / Assessment states
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);

  // Notifications toggle
  const [showNotifications, setShowNotifications] = useState(false);

  // Queries
  const { data: dashboardData, isLoading: dashLoading } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: fetchDashboard,
    enabled: !!user,
  });

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["studentProfile"],
    queryFn: fetchProfile,
    enabled: !!user,
  });

  const { data: roadmaps } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: fetchRoadmaps,
    enabled: activeTab === "roadmap",
  });

  const { data: projectsData } = useQuery({
    queryKey: ["studentProjects"],
    queryFn: fetchProjects,
    enabled: activeTab === "projects",
  });

  const { data: submissionsData } = useQuery({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
    enabled: activeTab === "projects",
  });

  const { data: mentors } = useQuery({
    queryKey: ["mentors"],
    queryFn: fetchMentors,
    enabled: activeTab === "mentor",
  });

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: !!user,
    refetchInterval: 10000, // Poll notifications every 10s
  });

  // Quiz / Assessment Queries
  const activeCourseIdForQuiz = dashboardData?.lastActiveEnrollment?.course?.id;
  const { data: quizzes } = useQuery({
    queryKey: ["courseQuizzes", activeCourseIdForQuiz],
    queryFn: () => fetchCourseQuizzes(activeCourseIdForQuiz),
    enabled: activeTab === "assessment" && !!activeCourseIdForQuiz,
  });

  const { data: quizQuestions } = useQuery({
    queryKey: ["quizQuestions", activeQuizId],
    queryFn: () => fetchQuizQuestions(activeQuizId),
    enabled: !!activeQuizId,
  });

  const { data: quizProgress } = useQuery({
    queryKey: ["quizProgress"],
    queryFn: fetchQuizProgress,
    enabled: activeTab === "assessment",
  });

  const { data: billingHistory } = useQuery({
    queryKey: ["billingHistory"],
    queryFn: fetchBillingHistory,
    enabled: activeTab === "settings",
  });

  const { data: enrolledCourses } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: fetchEnrolledCourse,
    enabled: activeTab === "learning",
  });

  const submitQuizMutation = useMutation({
    mutationFn: submitQuizAnswers,
    onSuccess: (resData) => {
      setQuizResults(resData);
      queryClient.invalidateQueries(["quizProgress"]);
      queryClient.invalidateQueries(["studentDashboard"]);
      queryClient.invalidateQueries(["studentProfile"]);
    },
    onError: (err) => {
      toast.error("Quiz submission failed: " + err.message);
    }
  });

  // Active Roadmap Selection
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
  const { data: roadmapNodes } = useQuery({
    queryKey: ["roadmapNodes", selectedRoadmapId],
    queryFn: () => fetchRoadmapNodes(selectedRoadmapId),
    enabled: !!selectedRoadmapId,
  });

  const { data: roadmapProgress } = useQuery({
    queryKey: ["roadmapProgress"],
    queryFn: fetchRoadmapProgress,
    enabled: activeTab === "roadmap",
  });

  useEffect(() => {
    if (roadmaps && roadmaps.length > 0 && !selectedRoadmapId) {
      setSelectedRoadmapId(roadmaps[0].id);
    }
  }, [roadmaps, selectedRoadmapId]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["studentProfile"]);
    },
  });

  const submitProjectMutation = useMutation({
    mutationFn: submitProject,
    onSuccess: () => {
      toast.success("Project submitted successfully!");
      queryClient.invalidateQueries(["submissions"]);
      queryClient.invalidateQueries(["studentDashboard"]);
    },
    onError: (err) => {
      toast.error("Failed to submit project: " + err.message);
    },
  });

  const requestSessionMutation = useMutation({
    mutationFn: requestMentorSession,
    onSuccess: () => {
      toast.success("Mentor session requested successfully!");
      queryClient.invalidateQueries(["studentDashboard"]);
    },
    onError: (err) => {
      toast.error("Booking failed: " + err.message);
    },
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["studentDashboard"]);
    },
  });

  // Handlers
  const handleMarkNotificationsRead = () => {
    markReadMutation.mutate();
  };

  const handleResumeCourse = () => {
    if (dashboardData?.lastActiveEnrollment?.course?.id) {
      navigate(`/course/${dashboardData.lastActiveEnrollment.course.id}/play`);
    } else {
      setActiveTab("learning");
    }
  };

  if (dashLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading student workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* ----------------- TOP NAVBAR ----------------- */}
      <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow shadow-blue-500/20">
            LS
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">LearnSpear Workspace</span>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative w-96 max-w-lg">
          <Search className="absolute left-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search lessons, projects, roadmaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/60 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors relative"
            >
              <Bell size={18} />
              {dashboardData?.notifications?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                  {dashboardData.notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-40 animate-fade-in">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">Notifications</span>
                  <button
                    onClick={handleMarkNotificationsRead}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {notificationsData?.length > 0 ? (
                    notificationsData.map((notif) => (
                      <div key={notif.id} className={`p-4 text-left transition-colors ${!notif.isRead ? 'bg-blue-50/20' : ''}`}>
                        <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">{notif.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-xs">No notifications yet</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mini User Tag */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              {user?.username?.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">{user?.username}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex w-full max-w-[1600px] mx-auto min-h-0">
        
        {/* ----------------- SIDEBAR MENU ----------------- */}
        <aside className="w-64 border-r border-slate-200/80 bg-white py-6 px-4 flex flex-col gap-6 hidden lg:flex shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block">workspace</span>
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
                onClick={() => setActiveTab("learning")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "learning"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <BookOpen size={18} />
                <span>Learning</span>
              </button>

              <button
                onClick={() => setActiveTab("roadmap")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "roadmap"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Milestone size={18} />
                <span>Roadmap</span>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "projects"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <FolderGit size={18} />
                <span>Projects</span>
              </button>

              <button
                onClick={() => setActiveTab("assessment")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "assessment"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <ClipboardList size={18} />
                <span>Assessments</span>
              </button>
            </nav>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block">collaboration</span>
            <nav className="flex flex-col gap-1 pt-2">
              <button
                onClick={() => setActiveTab("mentor")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "mentor"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Users size={18} />
                <span>Mentors</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <User size={18} />
                <span>Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "settings"
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ----------------- MAIN WORKSPACE PANELS ----------------- */}
        <main className="flex-1 flex overflow-y-auto px-6 py-8 min-w-0">
          <div className="flex-1 max-w-4xl mx-auto space-y-8 min-w-0">
            
            {/* ==================== TAB: DASHBOARD ==================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-fade-in">
                {/* Welcome Card */}
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-lg shadow-slate-950/10 flex justify-between items-center">
                  <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/25 blur-[120px] rounded-full"></div>
                  <div className="space-y-3 relative z-10 text-left">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={12} className="text-blue-400 animate-pulse" />
                      <span>Workspace Dashboard</span>
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight">Good evening, {user?.username}! 👋</h2>
                    <p className="text-sm text-slate-400 max-w-md">Let's build more code today. You are completing lessons 20% faster than average students.</p>
                  </div>
                  <div className="hidden md:block w-32 h-32 shrink-0 relative z-10 select-none">
                    <img
                      src="http://localhost:8080/images/student_avatar_clay.jpg"
                      alt="Student Character Illustration"
                      className="w-full h-full object-contain drop-shadow-2xl animate-float"
                    />
                  </div>
                </div>

                {/* Continue Learning Call-to-action */}
                {dashboardData?.lastActiveEnrollment ? (
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Continue Learning</span>
                      <h4 className="font-extrabold text-slate-800 text-base">{dashboardData.lastActiveEnrollment.course.title}</h4>
                      <p className="text-xs text-slate-400">Next sequence is ready for review</p>
                    </div>
                    <button
                      onClick={handleResumeCourse}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow shadow-blue-600/10 hover:shadow-lg transition-all"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Resume Course</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-4">
                    <BookOpen size={36} className="text-slate-300 mx-auto" />
                    <div>
                      <h4 className="font-bold text-slate-700">No active courses yet</h4>
                      <p className="text-xs text-slate-400 mt-1">Enroll in courses on the landing page to start studying.</p>
                    </div>
                  </div>
                )}

                {/* Weekly Analytics SVG Chart representation */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-left space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                      <TrendingUp size={20} className="text-blue-500" />
                      <span>Weekly Learning Minutes</span>
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">Last 7 days</span>
                  </div>

                  <div className="h-44 w-full flex items-end justify-between gap-4 pt-6 border-b border-slate-100">
                    {[
                      { day: "Mon", min: 45 },
                      { day: "Tue", min: 90 },
                      { day: "Wed", min: 30 },
                      { day: "Thu", min: 120 },
                      { day: "Fri", min: 60 },
                      { day: "Sat", min: 15 },
                      { day: "Sun", min: 80 }
                    ].map((item, idx) => {
                      const heightPercent = `${(item.min * 100) / 120}%`;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                          <div className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute mb-16">
                            {item.min}m
                          </div>
                          <div
                            style={{ height: heightPercent }}
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 group-hover:from-blue-600 group-hover:to-blue-500 rounded-t-lg transition-all cursor-pointer"
                          ></div>
                          <span className="text-[10px] font-semibold text-slate-400">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: LEARNING (MY COURSES) ==================== */}
            {activeTab === "learning" && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">My Registered Courses</h2>
                  <p className="text-sm text-slate-500">Pick any course to play, review resources, or write custom study notes.</p>
                </div>

                {enrolledCourses && enrolledCourses.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {enrolledCourses.map((enrollment) => (
                      <div key={enrollment.id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                        <div>
                          <div className="h-44 bg-slate-100 overflow-hidden relative">
                            <img
                              src={enrollment.course.imageUrl ? `http://localhost:8080/images/${enrollment.course.imageUrl}` : "https://picsum.photos/seed/learn/400/220"}
                              alt={enrollment.course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-6 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                {enrollment.course.category || "Development"}
                              </span>
                              <span className="text-xs font-bold text-blue-600">
                                {enrollment.progressPercentage || 0}% Done
                              </span>
                            </div>
                            <h3 className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                              {enrollment.course.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {enrollment.course.description}
                            </p>
                          </div>
                        </div>
                        <div className="p-6 pt-0 flex justify-between items-center border-t border-slate-50 mt-4">
                          <span className="text-xs font-bold text-slate-500">
                            {enrollment.course.lessons?.length || 0} Lessons
                          </span>
                          <button
                            onClick={() => navigate(`/course/${enrollment.course.id}/play`)}
                            className="px-4.5 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            <span>Play Class</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center border border-dashed border-slate-200 rounded-3xl text-sm space-y-4">
                    <p className="text-slate-400 font-medium">No active course registrations found. Explore our course catalog to unlock learning tracks!</p>
                    <button
                      onClick={() => navigate("/home")}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow"
                    >
                      Explore Courses
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB: ROADMAP (SKILL TIMELINE) ==================== */}
            {activeTab === "roadmap" && (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Interactive Learning Roadmap</h2>
                  <p className="text-sm text-slate-500">Visualize your milestones. Nodes unlock automatically as prerequisites are cleared.</p>
                </div>

                {/* Path Selector */}
                <div className="flex gap-2.5 border-b border-slate-200 pb-3">
                  {roadmaps?.map((path) => (
                    <button
                      key={path.id}
                      onClick={() => setSelectedRoadmapId(path.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedRoadmapId === path.id
                          ? "bg-blue-600 text-white shadow shadow-blue-600/10"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                      }`}
                    >
                      {path.title} ({path.level})
                    </button>
                  ))}
                </div>

                {/* Nodes Skill-Tree List */}
                <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 py-4 ml-4">
                  {roadmapNodes?.map((node, index) => {
                    // Match progress from student roadmap progress
                    const nodeProgress = roadmapProgress?.find(p => p.roadmapNode.id === node.id);
                    const isCompleted = nodeProgress?.status === "COMPLETED" || index < 2; // seed simulation
                    const isActive = nodeProgress?.status === "ACTIVE" || index === 2;
                    const isLocked = !isCompleted && !isActive;

                    return (
                      <div key={node.id} className="relative">
                        {/* Connecting node bullet indicator */}
                        <div
                          className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 flex items-center justify-center text-[10px] font-bold transition-colors ${
                            isCompleted
                              ? "bg-emerald-500 border-white text-white shadow-md shadow-emerald-500/20"
                              : isActive
                              ? "bg-blue-600 border-white text-white shadow-md shadow-blue-500/20 animate-pulse"
                              : "bg-slate-300 border-white text-slate-500"
                          }`}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>

                        <div className={`p-5 rounded-2xl border transition-all ${
                          isActive
                            ? "border-blue-500 ring-2 ring-blue-500/5 shadow-md shadow-blue-500/5 bg-white"
                            : isCompleted
                            ? "border-slate-200/80 bg-white shadow-sm"
                            : isLocked
                            ? "border-slate-150 bg-slate-100/30 opacity-65"
                            : ""
                        }`}>
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                                <span>{node.title}</span>
                                {isCompleted && (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-wider">
                                    Unlocked
                                  </span>
                                )}
                                {isActive && (
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase tracking-wider">
                                    Active Study
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-400">Node estimated time: {node.estimatedHours} Hours</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-500 block">+{node.xpReward} XP</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================== TAB: PROJECTS WORKSPACE ==================== */}
            {activeTab === "projects" && (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Project Capstone Workspace</h2>
                  <p className="text-sm text-slate-500">Submit GitHub links and view mentor review timelines for your capstone project tasks.</p>
                </div>

                {/* Submissions List */}
                <div className="space-y-4">
                  {projectsData?.map((project) => {
                    const submission = submissionsData?.find(s => s.project.id === project.id);
                    return (
                      <div key={project.id} className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
                        <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-4">
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider">
                              {project.difficulty}
                            </span>
                            <h3 className="font-extrabold text-slate-800 text-lg pt-1">{project.title}</h3>
                            <p className="text-xs text-slate-400">Max Review Score: {project.maxScore} XP</p>
                          </div>
                          <div>
                            {submission ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                submission.status === "APPROVED"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}>
                                {submission.status}
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider">
                                Assigned
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">{project.description}</p>

                        {/* Submission Form */}
                        {!submission || submission.status === "REJECTED" ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const github = e.target.elements.github.value;
                              const notes = e.target.elements.notes.value;
                              submitProjectMutation.mutate({ projectId: project.id, githubUrl: github, notes });
                            }}
                            className="space-y-3 pt-2"
                          >
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">GitHub Repository</label>
                              <input
                                name="github"
                                type="url"
                                placeholder="https://github.com/yourusername/repo"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Notes for Reviewer</label>
                              <textarea
                                name="notes"
                                placeholder="Include instructions to run tests, credentials etc."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 h-16 resize-none"
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={submitProjectMutation.isPending}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition-all"
                            >
                              {submitProjectMutation.isPending ? "Submitting..." : "Submit Project"}
                            </button>
                          </form>
                        ) : (
                          <div className="p-4 bg-slate-50 rounded-xl text-left text-xs space-y-2 border border-slate-100">
                            <div className="flex gap-2 text-slate-600">
                              <GitBranch size={14} />
                              <span className="font-semibold">Bound Repository:</span>
                              <a href={submission.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                {submission.githubUrl} <ExternalLink size={10} />
                              </a>
                            </div>
                            <div className="text-slate-400">
                              Submitted at: {new Date(submission.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================== TAB: MENTORS (LIVE SESSIONS) ==================== */}
            {activeTab === "mentor" && (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Mentorship Live Sessions</h2>
                  <p className="text-sm text-slate-500">Book live mock interviews, Q&A reviews, and session hours directly with course trainers.</p>
                </div>

                {/* Seeding booking scheduler */}
                <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-base">Request a Live Mentor Review</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const trainerId = e.target.elements.mentor.value;
                      const courseId = dashboardData?.lastActiveEnrollment?.course?.id;
                      const start = e.target.elements.datetime.value;

                      if (!courseId) {
                        toast.error("Please enroll in a course to book sessions.");
                        return;
                      }

                      requestSessionMutation.mutate({
                        trainerId,
                        courseId,
                        startTime: start + ":00",
                        endTime: start + ":30" // 30 mins session
                      });
                    }}
                    className="space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Mentor</label>
                        <select name="mentor" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500">
                          {mentors?.map(m => (
                            <option key={m.id} value={m.id}>{m.username}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Session Date & Time</label>
                        <input
                          type="datetime-local"
                          name="datetime"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={requestSessionMutation.isPending}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow transition-colors"
                    >
                      {requestSessionMutation.isPending ? "Requesting Session..." : "Confirm Requested Time"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ==================== TAB: PROFILE & ACHIEVEMENTS ==================== */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-fade-in text-left">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Achievements & Achievements Ledger</h2>
                  <p className="text-sm text-slate-500">Review unlocked gamified badges, total XP milestones, and verified certifications.</p>
                </div>

                {/* Profile Header card */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow shadow-blue-500/20">
                    {profileData?.username?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1 flex-1 text-center md:text-left">
                    <h3 className="text-xl font-extrabold text-slate-800">{profileData?.username}</h3>
                    <p className="text-xs text-slate-400">{profileData?.email}</p>
                    <p className="text-xs text-slate-500 pt-1">{profileData?.bio || "No biography added yet. Go to Settings to add one."}</p>
                  </div>
                  <div className="flex gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                    <div className="text-center">
                      <span className="text-2xl font-extrabold text-slate-800 block">{profileData?.xp || 0}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Total XP</span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-extrabold text-slate-800 block">🔥 {profileData?.streak || 0}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Streak Days</span>
                    </div>
                  </div>
                </div>

                {/* Unlocked Badges */}
                <div className="space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-base">Unlocked Badges</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {profileData?.badges?.map((badge) => (
                      <div key={badge.id} className="p-4 bg-white border border-slate-200/80 rounded-2xl text-center space-y-3 shadow-sm hover:shadow transition-shadow">
                        <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mx-auto shadow-sm">
                          <Award size={20} />
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs">{badge.name}</h4>
                        <p className="text-[10px] text-slate-400 leading-normal">{badge.description}</p>
                      </div>
                    ))}
                    {(!profileData?.badges || profileData.badges.length === 0) && (
                      <div className="col-span-4 p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs">
                        Complete lessons and submit capstones to earn badges!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: SETTINGS ==================== */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Workspace Preferences</h2>
                  <p className="text-sm text-slate-500">Update biography tags, profile picture and professional developer links.</p>
                </div>

                <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const bio = e.target.elements.bio.value;
                      const linkedin = e.target.elements.linkedin.value;
                      const github = e.target.elements.github.value;
                      const resume = e.target.elements.resume.value;
                      updateProfileMutation.mutate({ bio, linkedinUrl: linkedin, githubUrl: github, resumeUrl: resume });
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Biography</label>
                      <textarea
                        name="bio"
                        defaultValue={profileData?.bio || ""}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 h-20"
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">LinkedIn Profile</label>
                        <input
                          name="linkedin"
                          type="url"
                          defaultValue={profileData?.linkedinUrl || ""}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">GitHub Link</label>
                        <input
                          name="github"
                          type="url"
                          defaultValue={profileData?.githubUrl || ""}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Resume Link</label>
                        <input
                          name="resume"
                          type="url"
                          defaultValue={profileData?.resumeUrl || ""}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Preferences"}
                    </button>
                  </form>
                </div>

                {/* Billing & Payments History */}
                <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-extrabold text-slate-800 text-sm">Billing & Purchases Ledger</h3>
                    <p className="text-[11px] text-slate-400">Review transactions, discount coupons, and purchase receipts for enrolled courses.</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {billingHistory?.map((pay) => (
                      <div key={pay.id} className="py-3 flex justify-between items-center text-xs">
                        <div className="text-left space-y-0.5">
                          <h4 className="font-extrabold text-slate-800">{pay.course?.title}</h4>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            Txn: {pay.transactionId} • {new Date(pay.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right shrink-0 space-y-0.5">
                          <span className="font-extrabold text-slate-800 block">${pay.amount?.toFixed(2)}</span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-wider block text-center">
                            {pay.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!billingHistory || billingHistory.length === 0) && (
                      <div className="text-center text-slate-400 py-4 text-xs font-medium">
                        No transactions recorded.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: ASSESSMENTS / QUIZZES ==================== */}
            {activeTab === "assessment" && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Interactive Assessments & Quizzes</h2>
                  <p className="text-sm text-slate-500">Test your comprehension of lessons. Pass with 60% or more to earn +50 XP.</p>
                </div>

                <div className="space-y-4">
                  {quizzes?.map((quiz) => {
                    const progress = quizProgress?.find(p => p.quiz.id === quiz.id);
                    const isCompleted = progress?.passed;
                    const isFailed = progress && !progress.passed;

                    return (
                      <div key={quiz.id} className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-slate-800 text-base">{quiz.title}</h3>
                          <p className="text-xs text-slate-400">{quiz.description}</p>
                          {progress && (
                            <span className="text-[10px] text-slate-500 block pt-1 font-medium">
                              Last Attempt: {progress.score}% Score
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {isCompleted ? (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                              Passed
                            </span>
                          ) : isFailed ? (
                            <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider">
                              Failed
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider">
                              Available
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setActiveQuizId(quiz.id);
                              setQuizAnswers({});
                              setQuizResults(null);
                            }}
                            className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-colors"
                          >
                            {isCompleted ? "Retake Exam" : "Start Test"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {(!quizzes || quizzes.length === 0) && (
                    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-3xl text-xs">
                      No assessments configured for your active course yet. Enroll or start learning to unlock quizzes.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Quiz Play Console Modal */}
        {activeQuizId && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-150 animate-fade-in flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Interactive Examination</span>
                  <h3 className="font-extrabold text-slate-900 text-lg">Quiz Assessment</h3>
                </div>
                <button
                  onClick={() => {
                    setActiveQuizId(null);
                    setQuizAnswers({});
                    setQuizResults(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                {!quizResults ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitQuizMutation.mutate({ quizId: activeQuizId, answers: quizAnswers });
                    }}
                    className="space-y-6"
                  >
                    {quizQuestions?.map((q, idx) => (
                      <div key={q.id} className="space-y-3">
                        <h4 className="font-extrabold text-slate-800 text-sm">
                          {idx + 1}. {q.questionText}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {[
                            { key: "A", text: q.optionA },
                            { key: "B", text: q.optionB },
                            { key: "C", text: q.optionC },
                            { key: "D", text: q.optionD }
                          ].map(opt => (
                            <label
                              key={opt.key}
                              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                                quizAnswers[q.id] === opt.key
                                  ? "border-blue-500 bg-blue-50/20"
                                  : "border-slate-100 hover:border-slate-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={opt.key}
                                checked={quizAnswers[q.id] === opt.key}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt.key })}
                                required
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-xs font-semibold text-slate-700">
                                <span className="font-bold text-slate-400 mr-1.5">{opt.key}.</span>
                                {opt.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={submitQuizMutation.isPending}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
                    >
                      {submitQuizMutation.isPending ? "Evaluating Score..." : "Submit Assessment"}
                    </button>
                  </form>
                ) : (
                  <div className="py-8 text-center space-y-6 animate-fade-in">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg ${
                      quizResults.passed ? "bg-emerald-500 shadow-emerald-500/20" : "bg-rose-500 shadow-rose-500/20"
                    }`}>
                      {quizResults.passed ? "✓" : "✕"}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-extrabold text-slate-800">
                        {quizResults.passed ? "Congratulations! You Passed!" : "Assessment Failed"}
                      </h4>
                      <p className="text-xs text-slate-400">
                        You scored {quizResults.score}% by answering {quizResults.correctCount} of {quizResults.totalCount} questions correctly.
                      </p>
                      {quizResults.passed && (
                        <span className="inline-block px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-wider mt-2 animate-bounce">
                          +50 XP Earned
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setActiveQuizId(null);
                        setQuizAnswers({});
                        setQuizResults(null);
                      }}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all"
                    >
                      Return to Workspace
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- CONTEXTUAL RIGHT PANEL ----------------- */}
        <aside className="w-80 border-l border-slate-200/80 bg-white py-8 px-6 flex flex-col gap-6 hidden xl:flex shrink-0 text-left">
          
          {/* Learning Streak Indicators */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-orange-200/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider block">learning streak</span>
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1.5">
                <Flame size={20} className="text-orange-500 fill-orange-500 animate-pulse" />
                <span>{dashboardData?.streak || 0} Days</span>
              </h3>
            </div>
            <span className="text-xs text-orange-600 font-bold bg-orange-100/50 px-2.5 py-1 rounded-xl">Awesome</span>
          </div>

          {/* Daily Goal tracker */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>daily progress goal</span>
              <span className="text-slate-800">{dashboardData?.dailyGoal || 60}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${dashboardData?.dailyGoal || 60}%` }}
                className="bg-blue-500 h-full rounded-full transition-all duration-500 shadow-sm"
              ></div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Upcoming Session */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">upcoming appointments</span>
            {dashboardData?.upcomingSessions && dashboardData.upcomingSessions.length > 0 ? (
              dashboardData.upcomingSessions.map((session) => (
                <div key={session.id} className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-2">
                  <h4 className="font-extrabold text-xs text-slate-800">{session.course.title} Session</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Calendar size={12} />
                    <span>{new Date(session.startTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock size={12} />
                    <span>30 Minutes Review</span>
                  </div>
                  <a href={session.meetingLink} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                    <span>Google Meet link</span> <ExternalLink size={10} />
                  </a>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No upcoming sessions booked
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Mentor Profile info card */}
          {dashboardData?.lastActiveEnrollment?.course?.trainerName && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">assigned class mentor</span>
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 relative overflow-hidden">
                <div className="absolute top-[-30px] right-[-30px] w-36 h-36 bg-blue-500/10 blur-3xl rounded-full"></div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
                    {dashboardData.lastActiveEnrollment.course.trainerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <h4 className="font-extrabold text-xs">{dashboardData.lastActiveEnrollment.course.trainerName}</h4>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Senior Instructor</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("mentor")}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-[10px] transition-colors"
                >
                  Schedule Live Review
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};