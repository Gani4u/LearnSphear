import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "../store/AuthSlice";
import {
  LayoutDashboard, BookOpen, GitPullRequest, ClipboardCheck, FolderGit, Users, Calendar, Settings,
  Search, Plus, Sparkles, AlertCircle, Edit, Trash2, CheckCircle, XCircle, ArrowRight, Eye, Play,
  ExternalLink, FileText, Check, Save, X, BookOpenCheck, BarChart3, GraduationCap, Clock, Award, LogOut
} from "lucide-react";
import {
  fetchTrainerDashboard, fetchTrainerCourses, createCourse, updateCourse, deleteCourse,
  publishCourse, unpublishCourse, fetchSections, addSection, updateSection, deleteSection,
  fetchLessons, addLesson, updateLesson, deleteLesson, fetchCourseAssignments, createAssignment,
  updateAssignment, deleteAssignment, fetchAssignmentSubmissions, gradeAssignment,
  fetchCourseProjects, createProject, updateProject, deleteProject, fetchPendingSubmissions,
  gradeSubmission, fetchCourseStudents, fetchTrainerSessions
} from "../Api/trainerApi";

export const Mycourse = () => {
  const user = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out!");
    navigate("/login");
  };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Course selector for tab management
  const [selectedCourseId, setSelectedCourseId] = useState("");
  
  // Add/Edit Course Modal & states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: "", subtitle: "", description: "", level: "Beginner",
    category: "Backend Engineering", language: "English", price: 0.0,
    discount: 0.0, tags: "", requirements: "", outcomes: "", thumbnailUrl: "", bannerUrl: ""
  });

  // Section management states
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [sectionEditTitle, setSectionEditTitle] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");

  // Lesson Modal & states
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [lessonForm, setLessonForm] = useState({
    title: "", content: "", videoUrl: "", resourcesUrl: "",
    duration: 10, description: "", isPreview: false, lessonType: "VIDEO"
  });

  // Assignment states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "", description: "", deadlineDays: 7, maxMarks: 100, fileUrl: ""
  });
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeScore, setGradeScore] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");

  // Project states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "", description: "", difficulty: "Medium", deadlineDays: 7, maxScore: 100,
    githubRequired: true, rubric: ""
  });
  const [gradingProjectSub, setGradingProjectSub] = useState(null);
  const [projectScore, setProjectScore] = useState("");
  const [projectFeedback, setProjectFeedback] = useState("");

  // Queries
  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ["trainerDashboard"],
    queryFn: fetchTrainerDashboard,
    enabled: !!user,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["trainerCourses"],
    queryFn: fetchTrainerCourses,
    enabled: !!user,
  });

  // Derived queries based on selected course
  const { data: sections = [], refetch: refetchSections } = useQuery({
    queryKey: ["courseSections", selectedCourseId],
    queryFn: () => fetchSections(selectedCourseId),
    enabled: !!selectedCourseId && (activeTab === "curriculum"),
  });

  const { data: lessons = [], refetch: refetchLessons } = useQuery({
    queryKey: ["courseLessons", selectedCourseId],
    queryFn: () => fetchLessons(selectedCourseId),
    enabled: !!selectedCourseId && (activeTab === "curriculum"),
  });

  const { data: assignments = [], refetch: refetchAssignments } = useQuery({
    queryKey: ["courseAssignments", selectedCourseId],
    queryFn: () => fetchCourseAssignments(selectedCourseId),
    enabled: !!selectedCourseId && (activeTab === "assignments"),
  });

  const { data: submissions = [], refetch: refetchSubmissions } = useQuery({
    queryKey: ["assignmentSubmissions", selectedAssignmentId],
    queryFn: () => fetchAssignmentSubmissions(selectedAssignmentId),
    enabled: !!selectedAssignmentId && (activeTab === "assignments"),
  });

  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ["courseProjects", selectedCourseId],
    queryFn: () => fetchCourseProjects(selectedCourseId),
    enabled: !!selectedCourseId && (activeTab === "projects"),
  });

  const { data: pendingProjectSubs = [] } = useQuery({
    queryKey: ["pendingProjectSubmissions"],
    queryFn: fetchPendingSubmissions,
    enabled: activeTab === "projects" || activeTab === "dashboard",
  });

  const { data: students = [] } = useQuery({
    queryKey: ["courseStudents", selectedCourseId],
    queryFn: () => fetchCourseStudents(selectedCourseId),
    enabled: !!selectedCourseId && (activeTab === "students"),
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["trainerSessions"],
    queryFn: fetchTrainerSessions,
    enabled: activeTab === "sessions" || activeTab === "dashboard",
  });

  // Pre-select first course if none is selected yet
  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id.toString());
    }
  }, [courses, selectedCourseId]);

  // Mutations
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success("Course created! Set up curriculum next.");
      setShowCourseModal(false);
      queryClient.invalidateQueries(["trainerCourses"]);
      queryClient.invalidateQueries(["trainerDashboard"]);
    },
    onError: (e) => toast.error("Error creating course: " + e.message)
  });

  const updateCourseMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      toast.success("Course updated successfully!");
      setShowCourseModal(false);
      setEditingCourse(null);
      queryClient.invalidateQueries(["trainerCourses"]);
    },
    onError: (e) => toast.error("Error updating course: " + e.message)
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("Course deleted successfully.");
      queryClient.invalidateQueries(["trainerCourses"]);
    },
    onError: (e) => toast.error("Delete failed: " + (e.response?.data || e.message))
  });

  const publishCourseMutation = useMutation({
    mutationFn: publishCourse,
    onSuccess: () => {
      toast.success("Course published! Users can now enroll.");
      queryClient.invalidateQueries(["trainerCourses"]);
    }
  });

  const unpublishCourseMutation = useMutation({
    mutationFn: unpublishCourse,
    onSuccess: () => {
      toast.success("Course set back to DRAFT.");
      queryClient.invalidateQueries(["trainerCourses"]);
    }
  });

  // Section mutations
  const addSectionMutation = useMutation({
    mutationFn: addSection,
    onSuccess: () => {
      toast.success("Section added!");
      setNewSectionTitle("");
      refetchSections();
    }
  });

  const updateSectionMutation = useMutation({
    mutationFn: updateSection,
    onSuccess: () => {
      toast.success("Section updated!");
      setEditingSectionId(null);
      refetchSections();
    }
  });

  const deleteSectionMutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      toast.success("Section deleted.");
      refetchSections();
    }
  });

  // Lesson mutations
  const addLessonMutation = useMutation({
    mutationFn: addLesson,
    onSuccess: () => {
      toast.success("Lesson added!");
      setShowLessonModal(false);
      refetchLessons();
    }
  });

  const updateLessonMutation = useMutation({
    mutationFn: updateLesson,
    onSuccess: () => {
      toast.success("Lesson updated!");
      setShowLessonModal(false);
      setEditingLesson(null);
      refetchLessons();
    }
  });

  const deleteLessonMutation = useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => {
      toast.success("Lesson deleted.");
      refetchLessons();
    }
  });

  // Assignment mutations
  const createAssignmentMutation = useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      toast.success("Assignment created!");
      setShowAssignmentModal(false);
      refetchAssignments();
    }
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: updateAssignment,
    onSuccess: () => {
      toast.success("Assignment updated!");
      setShowAssignmentModal(false);
      setEditingAssignment(null);
      refetchAssignments();
    }
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      toast.success("Assignment deleted.");
      refetchAssignments();
    }
  });

  const gradeAssignmentMutation = useMutation({
    mutationFn: gradeAssignment,
    onSuccess: () => {
      toast.success("Assignment graded!");
      setGradingSubmission(null);
      refetchSubmissions();
    }
  });

  // Project mutations
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created!");
      setShowProjectModal(false);
      refetchProjects();
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      toast.success("Project updated!");
      setShowProjectModal(false);
      setEditingProject(null);
      refetchProjects();
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted.");
      refetchProjects();
    }
  });

  const gradeProjectMutation = useMutation({
    mutationFn: gradeSubmission,
    onSuccess: () => {
      toast.success("Project submission graded!");
      setGradingProjectSub(null);
      queryClient.invalidateQueries(["pendingProjectSubmissions"]);
    }
  });

  // Open modals handlers
  const openCreateCourseModal = () => {
    setEditingCourse(null);
    setCourseForm({
      title: "", subtitle: "", description: "", level: "Beginner",
      category: "Backend Engineering", language: "English", price: 0.0,
      discount: 0.0, tags: "", requirements: "", outcomes: "", thumbnailUrl: "", bannerUrl: ""
    });
    setShowCourseModal(true);
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || "",
      subtitle: course.subtitle || "",
      description: course.description || "",
      level: course.level || "Beginner",
      category: course.category || "Backend Engineering",
      language: course.language || "English",
      price: course.price || 0.0,
      discount: course.discount || 0.0,
      tags: course.tags || "",
      requirements: course.requirements || "",
      outcomes: course.outcomes || "",
      thumbnailUrl: course.thumbnailUrl || "",
      bannerUrl: course.bannerUrl || ""
    });
    setShowCourseModal(true);
  };

  const saveCourseForm = () => {
    if (!courseForm.title) {
      toast.warning("Title is required.");
      return;
    }
    if (editingCourse) {
      updateCourseMutation.mutate({ courseId: editingCourse.id, ...courseForm });
    } else {
      createCourseMutation.mutate(courseForm);
    }
  };

  const openAddLessonModal = (sectionId) => {
    setSelectedSectionId(sectionId);
    setEditingLesson(null);
    setLessonForm({
      title: "", content: "", videoUrl: "", resourcesUrl: "",
      duration: 10, description: "", isPreview: false, lessonType: "VIDEO"
    });
    setShowLessonModal(true);
  };

  const openEditLessonModal = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title || "",
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      resourcesUrl: lesson.resourcesUrl || "",
      duration: lesson.duration || 10,
      description: lesson.description || "",
      isPreview: lesson.isPreview || false,
      lessonType: lesson.lessonType || "VIDEO"
    });
    setShowLessonModal(true);
  };

  const saveLessonForm = () => {
    if (!lessonForm.title) {
      toast.warning("Lesson title is required.");
      return;
    }
    if (editingLesson) {
      updateLessonMutation.mutate({ lessonId: editingLesson.id, ...lessonForm });
    } else {
      addLessonMutation.mutate({ courseId: selectedCourseId, sectionId: selectedSectionId, ...lessonForm });
    }
  };

  const openAddAssignmentModal = () => {
    setEditingAssignment(null);
    setAssignmentForm({ title: "", description: "", deadlineDays: 7, maxMarks: 100, fileUrl: "" });
    setShowAssignmentModal(true);
  };

  const openEditAssignmentModal = (assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      title: assignment.title || "",
      description: assignment.description || "",
      deadlineDays: assignment.deadlineDays || 7,
      maxMarks: assignment.maxMarks || 100,
      fileUrl: assignment.fileUrl || ""
    });
    setShowAssignmentModal(true);
  };

  const saveAssignmentForm = () => {
    if (!assignmentForm.title) {
      toast.warning("Assignment title is required.");
      return;
    }
    if (editingAssignment) {
      updateAssignmentMutation.mutate({ assignmentId: editingAssignment.id, ...assignmentForm });
    } else {
      createAssignmentMutation.mutate({ courseId: selectedCourseId, ...assignmentForm });
    }
  };

  const openAddProjectModal = () => {
    setEditingProject(null);
    setProjectForm({ title: "", description: "", difficulty: "Medium", deadlineDays: 7, maxScore: 100, githubRequired: true, rubric: "" });
    setShowProjectModal(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title || "",
      description: proj.description || "",
      difficulty: proj.difficulty || "Medium",
      deadlineDays: proj.deadlineDays || 7,
      maxScore: proj.maxScore || 100,
      githubRequired: proj.githubRequired !== false,
      rubric: proj.rubric || ""
    });
    setShowProjectModal(true);
  };

  const saveProjectForm = () => {
    if (!projectForm.title) {
      toast.warning("Project title is required.");
      return;
    }
    if (editingProject) {
      updateProjectMutation.mutate({ projectId: editingProject.id, ...projectForm });
    } else {
      createProjectMutation.mutate({ courseId: selectedCourseId, ...projectForm });
    }
  };

  if (dashLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-400">Opening Trainer Dashboard...</span>
        </div>
      </div>
    );
  }

  const activeCourse = courses.find(c => c.id.toString() === selectedCourseId);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 flex font-sans">
      
      {/* ── SIDEBAR NAV ── */}
      <aside className="w-72 bg-[#111827] border-r border-slate-800 flex flex-col justify-between py-8 px-5 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight text-white">LearnSphear</h2>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Instructor Studio</span>
            </div>
          </div>

          <div className="px-3 py-2 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              {user?.username?.slice(0,2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Instructor</p>
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
              <span>Dashboard</span>
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
              <span>My Courses</span>
            </button>

            <button
              onClick={() => setActiveTab("curriculum")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "curriculum"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <GitPullRequest size={18} />
              <span>Curriculum Builder</span>
            </button>

            <button
              onClick={() => setActiveTab("assignments")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "assignments"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <ClipboardCheck size={18} />
              <span>Assignments</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "projects"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <FolderGit size={18} />
              <span>Capstone Projects</span>
            </button>

            <button
              onClick={() => setActiveTab("students")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "students"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Users size={18} />
              <span>Student Insights</span>
            </button>

            <button
              onClick={() => setActiveTab("sessions")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === "sessions"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Calendar size={18} />
              <span>Session Slots</span>
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-rose-400 hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-900/30"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
          <div className="text-xs text-slate-500 font-medium px-4 pt-4 border-t border-slate-800">
            © {new Date().getFullYear()} LearnSphear LMS
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main className="flex-1 min-w-0 flex flex-col">
        
        {/* Global Action Header */}
        <header className="h-20 bg-[#111827]/40 border-b border-slate-800 flex items-center justify-between px-8 backdrop-blur-md">
          {activeTab !== "dashboard" && courses.length > 0 ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Course:</span>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedAssignmentId("");
                }}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-1.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title} ({c.status})</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-lg font-bold text-white tracking-tight">
              {activeTab === "dashboard" ? "Instructor Overview" : "No Courses Created"}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={openCreateCourseModal}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4.5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
            >
              <Plus size={16} />
              <span>Build New Course</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          
          {/* ═══════════════════════════════════════════════════════════
              DASHBOARD TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Instructor Dashboard</h1>
                  <p className="text-slate-400 text-sm mt-1">Real-time engagement, rating reports, and platform insights.</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center shadow-inner">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{dashboard?.totalCourses || 0}</span>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Total Courses</p>
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shadow-inner">
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{dashboard?.activeStudents || 0}</span>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Enrolled Students</p>
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shadow-inner">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{dashboard?.pendingReviewsCount || 0}</span>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Pending Grading</p>
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center shadow-inner">
                    <Award size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{dashboard?.averageRating?.toFixed(1) || "N/A"} ★</span>
                    <p className="text-slate-400 text-xs font-semibold mt-1">Average Course Rating</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Courses List */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                    <BookOpenCheck size={18} className="text-indigo-400" />
                    <span>My Curation List</span>
                  </h3>
                  <div className="divide-y divide-slate-800 space-y-4">
                    {courses.slice(0, 4).map(course => (
                      <div key={course.id} className="pt-4 first:pt-0 flex items-center justify-between">
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-200 truncate">{course.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span>{course.category}</span>
                            <span>•</span>
                            <span>{course.level}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            course.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700/50 text-slate-300"
                          }`}>{course.status}</span>
                          <button
                            onClick={() => {
                              setSelectedCourseId(course.id.toString());
                              setActiveTab("curriculum");
                            }}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                          >
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Live Sessions */}
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-400" />
                    <span>Scheduled Mentor Sessions</span>
                  </h3>
                  {sessions.length === 0 ? (
                    <p className="text-slate-500 text-sm">No live slots booked at this time.</p>
                  ) : (
                    <div className="space-y-4">
                      {sessions.slice(0, 4).map(session => (
                        <div key={session.id} className="p-4 bg-slate-800/30 border border-slate-700/40 rounded-xl flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-white">Student ID: {session.studentId}</h4>
                            <p className="text-xs text-indigo-400 font-medium mt-0.5">
                              {session.startTime ? new Date(session.startTime).toLocaleString() : "Date TBD"}
                            </p>
                          </div>
                          {session.meetingLink && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              <span>Join Meet</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              MY COURSES TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Courses Catalog</h1>
                  <p className="text-slate-400 text-sm mt-1">Manage draft setups, view reports, or publish courses to platform.</p>
                </div>
              </div>

              {coursesLoading ? (
                <div className="text-center py-12"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
              ) : courses.length === 0 ? (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
                  <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white">Create your first Course</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">Get started by defining details, thumbnail headers, pricing structures, and outcomes.</p>
                  <button onClick={openCreateCourseModal} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md mt-6">
                    Define Course Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <div key={course.id} className="bg-[#111827] border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between">
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
                            course.status === "PUBLISHED" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                          }`}>{course.status}</span>
                        </div>
                        <div className="p-6">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{course.category}</span>
                          <h3 className="text-base font-bold text-white mt-1.5 truncate">{course.title}</h3>
                          <p className="text-slate-400 text-xs mt-2 line-clamp-2">{course.description || "No description set yet."}</p>
                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mt-4">
                            <span>{course.level}</span>
                            <span>•</span>
                            <span>{course.totalLessons || 0} Lessons</span>
                            <span>•</span>
                            <span>{course.totalStudents || 0} Students</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 border-t border-slate-800/50 bg-[#151c2c]/40 flex items-center gap-3">
                        <button
                          onClick={() => openEditCourseModal(course)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Edit size={13} />
                          <span>Configure</span>
                        </button>

                        {course.status === "DRAFT" ? (
                          <button
                            onClick={() => publishCourseMutation.mutate(course.id)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle size={13} />
                            <span>Publish</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => unpublishCourseMutation.mutate(course.id)}
                            className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <XCircle size={13} />
                            <span>Revert</span>
                          </button>
                        )}

                        {course.status === "DRAFT" && (
                          <button
                            onClick={() => { if(window.confirm("Are you sure?")) deleteCourseMutation.mutate(course.id); }}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              CURRICULUM TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "curriculum" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Curriculum Syllabus</h1>
                <p className="text-slate-400 text-sm mt-1">Structure chapters, lecture content links, and previews for learners.</p>
              </div>

              {!selectedCourseId ? (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
                  <BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white">No Course Selected</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">Before setting up your syllabus curriculum, you need to create a course template or select one from the header.</p>
                  <button onClick={openCreateCourseModal} className="bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md mt-6 transition-all">
                    Create Course Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Sections list */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <h3 className="font-bold text-white text-sm uppercase tracking-wider">Syllabus Chapters</h3>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add New Chapter Title..."
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              if (!newSectionTitle) return;
                              addSectionMutation.mutate({ courseId: selectedCourseId, title: newSectionTitle });
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl shadow-md transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {sections.length === 0 ? (
                        <p className="text-slate-500 text-xs py-4">No sections added to this course yet. Create a chapter first.</p>
                      ) : (
                        <div className="space-y-6">
                          {sections.map((section) => (
                            <div key={section.id} className="border border-slate-800/80 rounded-xl overflow-hidden">
                              <div className="bg-slate-850 p-4 border-b border-slate-800/60 flex items-center justify-between">
                                {editingSectionId === section.id ? (
                                  <div className="flex items-center gap-2 flex-1 mr-4">
                                    <input
                                      type="text"
                                      value={sectionEditTitle}
                                      onChange={(e) => setSectionEditTitle(e.target.value)}
                                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white flex-1"
                                    />
                                    <button
                                      onClick={() => updateSectionMutation.mutate({ sectionId: section.id, title: sectionEditTitle })}
                                      className="p-1 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white"
                                    >
                                      <Check size={14} />
                                    </button>
                                    <button
                                      onClick={() => setEditingSectionId(null)}
                                      className="p-1 bg-slate-700 rounded-md text-slate-300"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <span className="text-slate-500 font-bold text-xs">{section.sequence}.</span>
                                    <span className="font-bold text-white text-sm">{section.title}</span>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingSectionId(section.id);
                                      setSectionEditTitle(section.title);
                                    }}
                                    className="p-1.5 bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white rounded-lg transition-all"
                                  >
                                    <Edit size={12} />
                                  </button>
                                  <button
                                    onClick={() => { if(window.confirm("Delete section and all its lessons?")) deleteSectionMutation.mutate(section.id); }}
                                    className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                  <button
                                    onClick={() => openAddLessonModal(section.id)}
                                    className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                                  >
                                    <Plus size={11} />
                                    <span>Add Lesson</span>
                                  </button>
                                </div>
                              </div>

                              {/* Lessons list under section */}
                              <div className="divide-y divide-slate-800/40 p-2 bg-[#111827]/40 space-y-1">
                                {lessons.filter(l => l.sectionId === section.id || (l.section && l.section.id === section.id)).length === 0 ? (
                                  <p className="text-slate-600 text-xs py-3 px-4">No lessons in this chapter yet.</p>
                                ) : (
                                  lessons.filter(l => l.sectionId === section.id || (l.section && l.section.id === section.id)).map(lesson => (
                                    <div key={lesson.id} className="p-3 hover:bg-slate-800/20 rounded-lg flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/5 text-indigo-400 flex items-center justify-center">
                                          <Play size={14} />
                                        </div>
                                        <div>
                                          <span className="text-xs font-bold text-slate-300 block">{lesson.title}</span>
                                          <span className="text-[10px] text-slate-500 font-semibold uppercase">{lesson.lessonType} • {lesson.duration} mins</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          onClick={() => openEditLessonModal(lesson)}
                                          className="p-1.5 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-all"
                                        >
                                          <Edit size={12} />
                                        </button>
                                        <button
                                          onClick={() => { if(window.confirm("Delete lesson?")) deleteLessonMutation.mutate(lesson.id); }}
                                          className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course curriculum brief summary */}
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 h-fit space-y-4">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Curriculum Metrics</h3>
                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between py-2 border-b border-slate-850">
                        <span className="text-slate-400 font-semibold">Total Lessons Added</span>
                        <span className="font-bold text-white">{lessons.length}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-850">
                        <span className="text-slate-400 font-semibold">Estimated Total Duration</span>
                        <span className="font-bold text-white">{lessons.reduce((acc, l) => acc + (l.duration || 0), 0)} mins</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-400 font-semibold">Status Code</span>
                        <span className="font-bold text-indigo-400">{activeCourse?.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              ASSIGNMENTS TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "assignments" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Course Assignments</h1>
                  <p className="text-slate-400 text-sm mt-1">Review student submissions and assign hands-on problem statements.</p>
                </div>
                {selectedCourseId && (
                  <button
                    onClick={openAddAssignmentModal}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Plus size={14} />
                    <span>Create Assignment</span>
                  </button>
                )}
              </div>

              {!selectedCourseId ? (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
                  <ClipboardCheck size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white">No Course Selected</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">Before setting up problem tasks and assignments, you need to create a course template or select one from the header.</p>
                  <button onClick={openCreateCourseModal} className="bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md mt-6 transition-all">
                    Create Course Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Assignments lists */}
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Assignments Pool</h3>
                    {assignments.length === 0 ? (
                      <p className="text-slate-500 text-xs bg-[#111827] border border-slate-800 rounded-xl p-4">No assignments added yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            onClick={() => {
                              setSelectedAssignmentId(assignment.id.toString());
                              setGradingSubmission(null);
                            }}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${
                              selectedAssignmentId === assignment.id.toString()
                                ? "bg-indigo-655/10 border-indigo-500/80 text-white"
                                : "bg-[#111827] border-slate-800/80 hover:bg-[#141a27] text-slate-300"
                            }`}
                          >
                            <h4 className="font-bold text-sm">{assignment.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-2">Deadline: {assignment.deadlineDays} Days • Max marks: {assignment.maxMarks}</p>
                            <div className="flex items-center justify-end gap-2 mt-3">
                              <button
                                onClick={(e) => { e.stopPropagation(); openEditAssignmentModal(assignment); }}
                                className="p-1 hover:bg-slate-700/60 rounded text-slate-400 hover:text-white"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); if(window.confirm("Are you sure?")) deleteAssignmentMutation.mutate(assignment.id); }}
                                className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Submissions lists */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Submissions Grading Workspace</h3>
                    {!selectedAssignmentId ? (
                      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                        Click on an assignment to load student submissions.
                      </div>
                    ) : submissions.length === 0 ? (
                      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                        No submissions registered for this assignment yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {submissions.map((sub) => (
                          <div key={sub.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                            <div className="flex justify-between items-start border-b border-slate-800/50 pb-3 mb-3">
                              <div>
                                <h4 className="font-bold text-sm text-white">Student: {sub.studentUsername}</h4>
                                <span className="text-[10px] text-slate-400 mt-0.5 block">Submitted at: {new Date(sub.submittedAt).toLocaleString()}</span>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                sub.status === "GRADED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                              }`}>{sub.status}</span>
                            </div>

                            <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{sub.submissionText || "No text description submission."}</p>
                            
                            {sub.fileUrl && (
                              <a
                                href={sub.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-3.5"
                              >
                                <FileText size={12} />
                                <span>Attached File link</span>
                              </a>
                            )}

                            {sub.status === "GRADED" ? (
                              <div className="mt-4 p-4 bg-slate-850 rounded-xl border border-slate-800">
                                <span className="text-xs font-bold text-slate-300">Grade: {sub.grade} marks</span>
                                {sub.feedback && <p className="text-slate-400 text-xs mt-1.5">"{sub.feedback}"</p>}
                              </div>
                            ) : (
                              <div className="mt-4 border-t border-slate-800 pt-4">
                                {gradingSubmission?.id === sub.id ? (
                                  <div className="space-y-3">
                                    <div className="flex gap-4">
                                      <div className="w-1/4">
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Score</label>
                                        <input
                                          type="number"
                                          value={gradeScore}
                                          onChange={(e) => setGradeScore(e.target.value)}
                                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Feedback</label>
                                        <input
                                          type="text"
                                          value={gradeFeedback}
                                          onChange={(e) => setGradeFeedback(e.target.value)}
                                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => setGradingSubmission(null)}
                                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => {
                                          gradeAssignmentMutation.mutate({
                                            submissionId: sub.id,
                                            grade: parseInt(gradeScore) || 0,
                                            feedback: gradeFeedback
                                          });
                                        }}
                                        className="px-3 py-1 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-xs font-semibold text-white"
                                      >
                                        Submit Grade
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setGradingSubmission(sub);
                                      setGradeScore("");
                                      setGradeFeedback("");
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                                  >
                                    Grade Submission
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              PROJECTS TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Capstone Projects Hub</h1>
                  <p className="text-slate-400 text-sm mt-1">Configure project definitions and grade incoming capstones.</p>
                </div>
                {selectedCourseId && (
                  <button
                    onClick={openAddProjectModal}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Plus size={14} />
                    <span>Create Capstone</span>
                  </button>
                )}
              </div>

              {!selectedCourseId ? (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
                  <FolderGit size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white">No Course Selected</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">Before setting up Capstone Projects, you need to create a course template or select one from the header.</p>
                  <button onClick={openCreateCourseModal} className="bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md mt-6 transition-all">
                    Create Course Template
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Project list */}
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Project Definitions</h3>
                    {projects.length === 0 ? (
                      <p className="text-slate-500 text-xs bg-[#111827] border border-slate-800 rounded-xl p-4">No projects defined yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {projects.map(proj => (
                          <div key={proj.id} className="p-4 bg-[#111827] border border-slate-800/80 rounded-xl space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-white">{proj.title}</h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 uppercase">{proj.difficulty}</span>
                            </div>
                            <p className="text-slate-400 text-xs line-clamp-2">{proj.description}</p>
                            <div className="text-[10px] text-slate-400 font-semibold space-y-1">
                              <div>Rubric: <span className="text-slate-300 font-normal">{proj.rubric || "None defined"}</span></div>
                              <div>Deadline: <span className="text-slate-300 font-normal">{proj.deadlineDays} Days</span></div>
                              <div>Max Points: <span className="text-slate-300 font-normal">{proj.maxScore}</span></div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/40">
                              <button
                                onClick={() => openEditProjectModal(proj)}
                                className="p-1 hover:bg-slate-700/60 rounded text-slate-400 hover:text-white"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => { if(window.confirm("Are you sure?")) deleteProjectMutation.mutate(proj.id); }}
                                className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-455"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Pending Grading list */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Submissions Waiting Grading</h3>
                    {pendingProjectSubs.length === 0 ? (
                      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                        No pending capstone project submissions found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pendingProjectSubs.map((sub) => (
                          <div key={sub.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-6">
                            <div className="flex justify-between items-start border-b border-slate-800/50 pb-3 mb-3">
                              <div>
                                <h4 className="font-bold text-sm text-white">Project ID: {sub.project?.id}</h4>
                                <span className="text-[10px] text-slate-400 mt-0.5 block">Student ID: {sub.student?.id}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400">{sub.status}</span>
                            </div>

                            <div className="space-y-3 text-xs">
                              {sub.githubUrl && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400 font-semibold">GitHub Repo:</span>
                                  <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                                    <span>Repository</span>
                                    <ExternalLink size={10} />
                                  </a>
                                </div>
                              )}
                              {sub.liveDemo && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400 font-semibold">Live URL:</span>
                                  <a href={sub.liveDemo} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                                    <span>Deployment</span>
                                    <ExternalLink size={10} />
                                  </a>
                                </div>
                              )}
                              {sub.notes && (
                                <div>
                                  <span className="text-slate-400 font-semibold block mb-1">Student Notes:</span>
                                  <p className="bg-slate-800/30 border border-slate-700/30 p-2.5 rounded-lg text-slate-300 italic">"{sub.notes}"</p>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 border-t border-slate-800 pt-4">
                              {gradingProjectSub?.id === sub.id ? (
                                <div className="space-y-3">
                                  <div className="flex gap-4">
                                    <div className="w-1/4">
                                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Score</label>
                                      <input
                                        type="number"
                                        value={projectScore}
                                        onChange={(e) => setProjectScore(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Feedback</label>
                                      <input
                                        type="text"
                                        value={projectFeedback}
                                        onChange={(e) => setProjectFeedback(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setGradingProjectSub(null)}
                                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => {
                                        gradeProjectMutation.mutate({
                                          submissionId: sub.id,
                                          status: "APPROVED",
                                          score: parseInt(projectScore) || 0,
                                          feedback: projectFeedback
                                        });
                                      }}
                                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        gradeProjectMutation.mutate({
                                          submissionId: sub.id,
                                          status: "REJECTED",
                                          score: 0,
                                          feedback: projectFeedback
                                        });
                                      }}
                                      className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-semibold text-white"
                                    >
                                      Request Changes
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setGradingProjectSub(sub);
                                    setProjectScore("");
                                    setProjectFeedback("");
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                                >
                                  Grade Capstone Project
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STUDENTS TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Student Insights</h1>
                <p className="text-slate-400 text-sm mt-1">Review student progress percentages, completions, and session metrics.</p>
              </div>

              {!selectedCourseId ? (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center">
                  <Users size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white">No Course Selected</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">Before viewing student details and learning insights, you need to create a course template or select one from the header.</p>
                  <button onClick={openCreateCourseModal} className="bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md mt-6 transition-all">
                    Create Course Template
                  </button>
                </div>
              ) : students.length === 0 ? (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                  No students currently enrolled in this course.
                </div>
              ) : (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800/40 border-b border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider">
                        <th className="p-4">Student</th>
                        <th className="p-4">Enrollment Date</th>
                        <th className="p-4">Progress</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Last Accessed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
                      {students.map((student) => (
                        <tr key={student.enrollmentId} className="hover:bg-slate-800/20">
                          <td className="p-4 font-semibold text-white">{student.trainerName || "Unknown student"}</td>
                          <td className="p-4">{student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : "—"}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-50 h-full" style={{ width: `${student.progressPercentage}%` }} />
                              </div>
                              <span className="font-bold text-white">{student.progressPercentage}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              student.completed ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700/50 text-slate-400"
                            }`}>{student.completed ? "COMPLETED" : "IN PROGRESS"}</span>
                          </td>
                          <td className="p-4">{student.lastAccessedAt ? new Date(student.lastAccessedAt).toLocaleString() : "Never"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              SESSIONS TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "sessions" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Mentoring Sessions</h1>
                <p className="text-slate-400 text-sm mt-1">Review live video meeting slots booked by learners.</p>
              </div>

              {sessions.length === 0 ? (
                <div className="bg-[#111827] border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                  No upcoming mentor sessions scheduled.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.map((session) => (
                    <div key={session.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">Course ID: {session.courseId || "LearnSphear Course"}</h4>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Student ID: {session.studentId}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          session.status === "SCHEDULED" ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-700 text-slate-300"
                        }`}>{session.status}</span>
                      </div>
                      
                      <div className="text-xs space-y-1 bg-slate-850 p-3 rounded-lg border border-slate-800">
                        <div className="flex justify-between text-slate-400">
                          <span>Starts</span>
                          <span className="text-slate-200 font-medium">{session.startTime ? new Date(session.startTime).toLocaleString() : "Date TBD"}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Ends</span>
                          <span className="text-slate-200 font-medium">{session.endTime ? new Date(session.endTime).toLocaleString() : "Date TBD"}</span>
                        </div>
                      </div>

                      {session.meetingLink && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <span>Open Meeting Link</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ── COURSE DIALOG MODAL ── */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">{editingCourse ? "Configure Course Template" : "Build Course Template"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course Title</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="e.g. Next.js Foundations"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subtitle</label>
                <input
                  type="text"
                  value={courseForm.subtitle}
                  onChange={(e) => setCourseForm({ ...courseForm, subtitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="e.g. Master routing, state management, layouts"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  rows={3}
                  placeholder="Write a high conversion description details..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                <select
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                >
                  <option value="Backend Engineering">Backend Engineering</option>
                  <option value="Frontend Engineering">Frontend Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Difficulty Level</label>
                <select
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Base Price (INR)</label>
                <input
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discount (%)</label>
                <input
                  type="number"
                  value={courseForm.discount}
                  onChange={(e) => setCourseForm({ ...courseForm, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Thumbnail URL</label>
                <input
                  type="text"
                  value={courseForm.thumbnailUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="https://image-bucket/thumbnail.jpg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Banner Image URL</label>
                <input
                  type="text"
                  value={courseForm.bannerUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, bannerUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="https://image-bucket/banner.jpg"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tags (comma separated)</label>
                <input
                  type="text"
                  value={courseForm.tags}
                  onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="nextjs, react, frontend"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prerequisite Requirements</label>
                <textarea
                  value={courseForm.requirements}
                  onChange={(e) => setCourseForm({ ...courseForm, requirements: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  rows={2}
                  placeholder="e.g. Basic HTML & CSS required, understanding arrays."
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outcomes / What students learn</label>
                <textarea
                  value={courseForm.outcomes}
                  onChange={(e) => setCourseForm({ ...courseForm, outcomes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  rows={2}
                  placeholder="e.g. Deploy full-stack apps to production, structure database routing."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowCourseModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Discard
              </button>
              <button
                onClick={saveCourseForm}
                className="bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Save Course Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LESSON DIALOG MODAL ── */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">{editingLesson ? "Configure Lesson Details" : "Add Lecture Content"}</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lesson Title</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="e.g. Introduction to Next.js routing"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Video URL link (YouTube/Vimeo)</label>
                <input
                  type="text"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attachment Resources URL link</label>
                <input
                  type="text"
                  value={lessonForm.resourcesUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, resourcesUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration (mins)</label>
                  <input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lesson Type</label>
                  <select
                    value={lessonForm.lessonType}
                    onChange={(e) => setLessonForm({ ...lessonForm, lessonType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  >
                    <option value="VIDEO">Video</option>
                    <option value="TEXT">Text Documentation</option>
                    <option value="QUIZ">Interactive Quiz</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-850 p-3 rounded-xl border border-slate-850">
                <input
                  type="checkbox"
                  id="isPreview"
                  checked={lessonForm.isPreview}
                  onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-650 bg-slate-900 border-slate-700"
                />
                <label htmlFor="isPreview" className="text-xs text-slate-300 font-semibold cursor-pointer">Allow Unauthenticated Course Preview</label>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description Details / Script content</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowLessonModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Discard
              </button>
              <button
                onClick={saveLessonForm}
                className="bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Save Lecture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ASSIGNMENT DIALOG MODAL ── */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">{editingAssignment ? "Edit Assignment Settings" : "Build Assignment Template"}</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Problem Title</label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="e.g. Build an Express middleware wrapper"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detailed Instructions / Description</label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  rows={4}
                  placeholder="Write clear instructions..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deadline (Days)</label>
                  <input
                    type="number"
                    value={assignmentForm.deadlineDays}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, deadlineDays: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Max Score Marks</label>
                  <input
                    type="number"
                    value={assignmentForm.maxMarks}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: parseInt(e.target.value) || 100 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resource PDF link (optional)</label>
                <input
                  type="text"
                  value={assignmentForm.fileUrl}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, fileUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Discard
              </button>
              <button
                onClick={saveAssignmentForm}
                className="bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROJECT DIALOG MODAL ── */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">{editingProject ? "Configure Project Settings" : "Define Capstone Project Template"}</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Capstone Project Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  placeholder="e.g. Build an E-commerce API"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description Specifications</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Difficulty</label>
                  <select
                    value={projectForm.difficulty}
                    onChange={(e) => setProjectForm({ ...projectForm, difficulty: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deadline (Days)</label>
                  <input
                    type="number"
                    value={projectForm.deadlineDays}
                    onChange={(e) => setProjectForm({ ...projectForm, deadlineDays: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Max Score Points</label>
                  <input
                    type="number"
                    value={projectForm.maxScore}
                    onChange={(e) => setProjectForm({ ...projectForm, maxScore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-4">
                  <input
                    type="checkbox"
                    id="githubRequired"
                    checked={projectForm.githubRequired}
                    onChange={(e) => setProjectForm({ ...projectForm, githubRequired: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-650 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="githubRequired" className="text-xs text-slate-300 font-semibold cursor-pointer">Enforce GitHub Submission link</label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grading Rubrics / Requirements Checklist</label>
                <textarea
                  value={projectForm.rubric}
                  onChange={(e) => setProjectForm({ ...projectForm, rubric: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white"
                  rows={3}
                  placeholder="e.g. Relational models: 30%, Swagger docs: 20%"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowProjectModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Discard
              </button>
              <button
                onClick={saveProjectForm}
                className="bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Save Capstone
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Mycourse;