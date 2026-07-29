import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  BookOpen,
  FolderGit,
  Calendar,
  Settings,
  Search,
  ExternalLink,
  ChevronRight,
  Plus,
  TrendingUp,
  Sparkles,
  GitBranch,
  CheckCircle2,
  XCircle,
  Video
} from "lucide-react";
import {
  fetchTrainerDashboard,
  fetchTrainerCourses,
  createCourse,
  addLesson,
  fetchPendingSubmissions,
  gradeSubmission,
  fetchTrainerSessions
} from "../Api/trainerApi";

export const Mycourse = () => {
  const user = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals/expanders toggles
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(null); // for lesson adding

  // Queries
  const { data: dashboardData, isLoading: dashLoading } = useQuery({
    queryKey: ["trainerDashboard"],
    queryFn: fetchTrainerDashboard,
    enabled: !!user,
  });

  const { data: courses } = useQuery({
    queryKey: ["trainerCourses"],
    queryFn: fetchTrainerCourses,
    enabled: activeTab === "courses",
  });

  const { data: submissions } = useQuery({
    queryKey: ["pendingSubmissions"],
    queryFn: fetchPendingSubmissions,
    enabled: activeTab === "capstones",
  });

  const { data: sessions } = useQuery({
    queryKey: ["trainerSessions"],
    queryFn: fetchTrainerSessions,
    enabled: activeTab === "sessions" || activeTab === "dashboard",
  });

  // Mutations
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success("Course created successfully!");
      setShowCourseModal(false);
      queryClient.invalidateQueries(["trainerCourses"]);
      queryClient.invalidateQueries(["trainerDashboard"]);
    },
  });

  const addLessonMutation = useMutation({
    mutationFn: addLesson,
    onSuccess: () => {
      toast.success("Lesson added successfully!");
      setActiveCourseId(null);
      queryClient.invalidateQueries(["trainerCourses"]);
    },
  });

  const gradeMutation = useMutation({
    mutationFn: gradeSubmission,
    onSuccess: () => {
      toast.success("Grading submitted successfully!");
      queryClient.invalidateQueries(["pendingSubmissions"]);
      queryClient.invalidateQueries(["trainerDashboard"]);
    },
  });

  // Handlers
  const handleCreateCourse = (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value;
    const description = e.target.elements.description.value;
    const level = e.target.elements.level.value;
    const category = e.target.elements.category.value;
    const price = e.target.elements.price.value;
    const imageUrl = e.target.elements.image.value; // string

    createCourseMutation.mutate({
      title,
      description,
      level,
      category,
      price: parseFloat(price) || 0.00,
      imageUrl
    });
  };

  const handleAddLesson = (e, courseId) => {
    e.preventDefault();
    const title = e.target.elements.lessonTitle.value;
    const content = e.target.elements.content.value;
    const duration = parseInt(e.target.elements.duration.value) || 10;
    const videoUrl = e.target.elements.video.value || "";

    addLessonMutation.mutate({
      courseId,
      lessonData: { title, content, duration, videoUrl }
    });
  };

  const handleGradeSubmission = (e, submissionId, status) => {
    e.preventDefault();
    const feedback = e.target.elements.feedback.value;
    const rating = parseInt(e.target.elements.rating.value) || 5;

    gradeMutation.mutate({
      submissionId,
      status,
      feedback,
      rating
    });
  };

  if (dashLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading trainer dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* ----------------- TOP NAVBAR ----------------- */}
      <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow shadow-indigo-500/20">
            LS
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">Trainer Workspace</span>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex items-center relative w-96 max-w-lg">
          <Search className="absolute left-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search courses, submissions, sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/60 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Mini User Tag */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            {user?.username?.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Trainer: {user?.username}</span>
        </div>
      </header>

      <div className="flex-1 flex w-full max-w-[1600px] mx-auto min-h-0">
        
        {/* ----------------- SIDEBAR MENU ----------------- */}
        <aside className="w-64 border-r border-slate-200/80 bg-white py-6 px-4 flex flex-col gap-6 hidden lg:flex shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block">management</span>
            <nav className="flex flex-col gap-1 pt-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "dashboard"
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "courses"
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <BookOpen size={18} />
                <span>My Courses</span>
              </button>

              <button
                onClick={() => setActiveTab("capstones")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "capstones"
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <FolderGit size={18} />
                <span>Capstone Reviews</span>
              </button>
            </nav>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block">appointments</span>
            <nav className="flex flex-col gap-1 pt-2">
              <button
                onClick={() => setActiveTab("sessions")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "sessions"
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Calendar size={18} />
                <span>Sessions Slots</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === "settings"
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings size={18} />
                <span>Preferences</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ----------------- MAIN WORKSPACE PANELS ----------------- */}
        <main className="flex-1 flex overflow-y-auto px-6 py-8 min-w-0">
          <div className="flex-1 max-w-4xl mx-auto space-y-8 min-w-0">
            
            {/* ==================== TAB: DASHBOARD ==================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-fade-in text-left">
                {/* Greeting card */}
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-lg flex justify-between items-center">
                  <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                  <div className="space-y-3 relative z-10">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={12} className="text-indigo-400 animate-pulse" />
                      <span>Trainer Panel Dashboard</span>
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back, Coach! 👋</h2>
                    <p className="text-sm text-slate-400 max-w-md">Track student performance metrics, manage materials catalog, and grade submissions from a unified console.</p>
                  </div>
                  <div className="hidden md:block w-32 h-32 shrink-0 relative z-10 select-none">
                    <img
                      src="http://localhost:8080/images/trainer_avatar_clay.jpg"
                      alt="Trainer Character Illustration"
                      className="w-full h-full object-contain drop-shadow-2xl animate-float"
                    />
                  </div>
                </div>

                {/* Trainer Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">courses taught</span>
                    <span className="text-3xl font-extrabold text-slate-800 block pt-1">{dashboardData?.totalCourses || 0}</span>
                  </div>
                  <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">active students</span>
                    <span className="text-3xl font-extrabold text-slate-800 block pt-1">{dashboardData?.activeStudents || 0}</span>
                  </div>
                  <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">pending reviews</span>
                    <span className="text-3xl font-extrabold text-indigo-600 block pt-1">{dashboardData?.pendingReviewsCount || 0}</span>
                  </div>
                  <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">average rating</span>
                    <span className="text-3xl font-extrabold text-slate-800 block pt-1">★ {dashboardData?.averageRating?.toFixed(1) || "5.0"}</span>
                  </div>
                </div>

                {/* SVG Student Growth mock Chart */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                      <TrendingUp size={20} className="text-indigo-600" />
                      <span>Unique Enrolled Students Trend</span>
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">Monthly scale</span>
                  </div>
                  <div className="h-40 w-full flex items-end justify-between gap-6 pt-6 border-b border-slate-100">
                    {[
                      { month: "Jan", count: 12 },
                      { month: "Feb", count: 24 },
                      { month: "Mar", count: 48 },
                      { month: "Apr", count: 90 },
                      { month: "May", count: 120 }
                    ].map((item, idx) => {
                      const heightPercent = `${(item.count * 100) / 150}%`;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <div className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute mb-16">
                            {item.count} students
                          </div>
                          <div
                            style={{ height: heightPercent }}
                            className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 group-hover:from-indigo-600 group-hover:to-indigo-500 rounded-t-lg transition-all cursor-pointer"
                          ></div>
                          <span className="text-[10px] font-semibold text-slate-400">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: COURSES MANAGER ==================== */}
            {activeTab === "courses" && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Course Creator</h2>
                    <p className="text-sm text-slate-500">Add courses, manage sequences, and insert new video lectures.</p>
                  </div>
                  <button
                    onClick={() => setShowCourseModal(true)}
                    className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Create Course</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {courses?.map((course) => (
                    <div key={course.id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="p-6 space-y-3">
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                            {course.level} | {course.category}
                          </span>
                          <h3 className="font-extrabold text-slate-800 text-base">{course.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{course.description}</p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 space-y-4">
                        <hr className="border-slate-50" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">
                            Price: ${course.price?.toFixed(2) || "0.00"}
                          </span>
                          <button
                            onClick={() => setActiveCourseId(activeCourseId === course.id ? null : course.id)}
                            className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                          >
                            <span>Add Lesson</span>
                            <ChevronRight size={14} className={`transition-transform ${activeCourseId === course.id ? 'rotate-90' : ''}`} />
                          </button>
                        </div>

                        {/* Add Lesson Form Wrapper */}
                        {activeCourseId === course.id && (
                          <form
                            onSubmit={(e) => handleAddLesson(e, course.id)}
                            className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-3 pt-3"
                          >
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Lesson Title</label>
                              <input
                                name="lessonTitle"
                                required
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Video File / URL Name</label>
                              <input
                                name="video"
                                placeholder="demo.mp4"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Duration (Mins)</label>
                                <input
                                  name="duration"
                                  type="number"
                                  placeholder="10"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Lecture Contents</label>
                              <textarea
                                name="content"
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none h-16 resize-none"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
                            >
                              Save Lesson
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!courses || courses.length === 0) && (
                    <div className="col-span-2 p-8 text-center text-slate-400">No courses created yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== TAB: CAPSTONE PROJECTS GRADING ==================== */}
            {activeTab === "capstones" && (
              <div className="space-y-6 animate-fade-in text-left">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Capstone Reviews</h2>
                  <p className="text-sm text-slate-500">Grade submissions, check GitHub branches, and award student XP points.</p>
                </div>

                <div className="space-y-4">
                  {submissions?.map((sub) => (
                    <div key={sub.id} className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
                      <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase tracking-wider">
                            Pending Review
                          </span>
                          <h3 className="font-extrabold text-slate-800 text-base pt-1">
                            {sub.project.title} — Submitted by {sub.student.username}
                          </h3>
                          <p className="text-xs text-slate-400">Course: {sub.project.course.title}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">{sub.notes || "No submission notes provided."}</p>

                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center text-xs">
                        <div className="flex gap-2 text-slate-600">
                          <GitBranch size={14} />
                          <span className="font-semibold">GitHub Branch:</span>
                          <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                            {sub.githubUrl} <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>

                      {/* Grading form */}
                      <form
                        onSubmit={(e) => handleGradeSubmission(e, sub.id, "APPROVED")}
                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Review Grade (1 - 5)</label>
                            <input
                              type="number"
                              name="rating"
                              min="1"
                              max="5"
                              defaultValue="5"
                              required
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Grading Feedback Comments</label>
                          <textarea
                            name="feedback"
                            placeholder="Write constructive notes for the student..."
                            required
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none h-16 resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve & Award XP</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              const form = e.target.closest("form");
                              const feedback = form.elements.feedback.value;
                              if (!feedback) {
                                toast.error("Feedback comments are required for rejection.");
                                return;
                              }
                              gradeMutation.mutate({ submissionId: sub.id, status: "REJECTED", feedback, rating: 2 });
                            }}
                            className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <XCircle size={14} />
                            <span>Needs Changes</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ))}
                  {(!submissions || submissions.length === 0) && (
                    <div className="p-8 text-center text-slate-400">No project submissions pending review.</div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== TAB: SESSIONS SCHEDULES ==================== */}
            {activeTab === "sessions" && (
              <div className="space-y-6 animate-fade-in text-left">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Scheduled Live Appointments</h2>
                  <p className="text-sm text-slate-500">Track 1-on-1 mock interviews, QA reviews, and sessions slots.</p>
                </div>

                <div className="space-y-4">
                  {sessions?.map((session) => (
                    <div key={session.id} className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                          <Video size={20} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">{session.course.title} Session</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block">Student: {session.student.username}</span>
                          <span className="text-[10px] text-slate-400 block">{new Date(session.startTime).toLocaleString()}</span>
                        </div>
                      </div>
                      <a href={session.meetingLink} target="_blank" rel="noreferrer" className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1">
                        <span>Launch Session</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                  {(!sessions || sessions.length === 0) && (
                    <div className="p-8 text-center text-slate-400">No scheduled sessions booked.</div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== TAB: PREFERENCES ==================== */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-fade-in text-left">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Preferences Settings</h2>
                  <p className="text-sm text-slate-500">Manage instructor biographic information.</p>
                </div>

                <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
                  <div className="text-slate-400 text-xs text-center py-6">Preferences dashboard is fully set up. Profile changes are saved in database.</div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ----------------- CONTEXTUAL RIGHT PANEL ----------------- */}
        <aside className="w-80 border-l border-slate-200/80 bg-white py-8 px-6 flex flex-col gap-6 shrink-0 hidden xl:flex text-left">
          {/* Stats Overview */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 space-y-1">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">pending task list</span>
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1.5">
              <span>{dashboardData?.pendingReviewsCount || 0} Submissions</span>
            </h3>
            <span className="text-[10px] text-slate-400 block pt-1">Needs review as soon as possible</span>
          </div>

          <hr className="border-slate-100" />

          {/* Next Session */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">upcoming calendar session</span>
            {sessions && sessions.length > 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-2">
                <h4 className="font-extrabold text-xs text-slate-800">{sessions[0].course.title} Session</h4>
                <div className="text-[11px] text-slate-500">Student: {sessions[0].student.username}</div>
                <div className="text-[11px] text-slate-500">Time: {new Date(sessions[0].startTime).toLocaleString()}</div>
                <a href={sessions[0].meetingLink} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  <span>Google Meet link</span> <ExternalLink size={10} />
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No sessions booked today
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Course Creation Modal Popup */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-150 animate-fade-in p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">Create New Course</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Course Title</label>
                <input
                  name="title"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Level</label>
                  <select name="level" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Category</label>
                  <input
                    name="category"
                    placeholder="Java, Python etc."
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="49.99"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Thumbnail Image URL</label>
                  <input
                    name="image"
                    placeholder="course1.jpg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Course Description</label>
                <textarea
                  name="description"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none h-20 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={createCourseMutation.isPending}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                {createCourseMutation.isPending ? "Creating Course..." : "Confirm & Launch Course"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};