import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "../store/AuthSlice";
import {
  LayoutDashboard, BookOpen, Compass, FolderGit2, ClipboardCheck,
  Award, Heart, Bell, LogOut, Search, TrendingUp, CheckCircle2,
  Clock, Play, Star, ChevronRight, Sparkles, Target, Flame,
  BookMarked, GraduationCap, BarChart3, Gift, Medal
} from "lucide-react";
import {
  fetchDashboard, fetchEnrolledCourses, exploreCourses,
  fetchStudentAssignments, fetchCertificates, fetchWishlist,
  fetchNotifications, markNotificationsRead, submitProject,
  fetchProjects, fetchSubmissions, submitAssignment, fetchBillingHistory,
  addToWishlist, removeFromWishlist, checkoutCourse
} from "../Api/studentApi";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "my-courses", label: "My Courses", icon: BookOpen },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "assignments", label: "Assignments", icon: ClipboardCheck },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "notifications", label: "Alerts", icon: Bell },
];

const CATEGORIES = ["All", "Backend Engineering", "Frontend Engineering", "Data Science", "DevOps", "Mobile", "Design"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export const Mylearning = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreCategory, setExploreCategory] = useState("All");
  const [exploreLevel, setExploreLevel] = useState("All");
  const [exploreSearch, setExploreSearch] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ githubUrl: "", liveDemo: "", notes: "" });
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentText, setAssignmentText] = useState("");

  // Queries
  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: fetchDashboard,
    enabled: !!user,
  });

  const { data: enrolledCourses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: fetchEnrolledCourses,
    enabled: activeTab === "my-courses" || activeTab === "dashboard",
  });

  const { data: exploreData = [] } = useQuery({
    queryKey: ["exploreCourses", exploreSearch, exploreCategory, exploreLevel],
    queryFn: () => exploreCourses({ search: exploreSearch, category: exploreCategory, level: exploreLevel }),
    enabled: activeTab === "explore",
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["studentAssignments"],
    queryFn: fetchStudentAssignments,
    enabled: activeTab === "assignments",
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ["certificates"],
    queryFn: fetchCertificates,
    enabled: activeTab === "certificates",
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: activeTab === "wishlist",
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: activeTab === "notifications" || activeTab === "dashboard",
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["studentProjects"],
    queryFn: fetchProjects,
    enabled: activeTab === "projects",
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ["projectSubmissions"],
    queryFn: fetchSubmissions,
    enabled: activeTab === "projects",
  });

  // Mutations
  const projectMutation = useMutation({
    mutationFn: submitProject,
    onSuccess: () => {
      toast.success("Project submitted successfully! 🚀");
      setShowProjectModal(false);
      queryClient.invalidateQueries(["projectSubmissions"]);
    },
    onError: (e) => toast.error("Submission failed: " + e.message),
  });

  const assignmentMutation = useMutation({
    mutationFn: submitAssignment,
    onSuccess: () => {
      toast.success("Assignment submitted! ✅");
      setShowAssignmentModal(false);
      queryClient.invalidateQueries(["studentAssignments"]);
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: ({ courseId, isWishlisted }) =>
      isWishlisted ? removeFromWishlist(courseId) : addToWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
      queryClient.invalidateQueries(["exploreCourses"]);
    },
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId) => checkoutCourse({ courseId, couponCode: null }),
    onSuccess: (data, courseId) => {
      toast.success("Enrolled successfully! 🎉");
      queryClient.invalidateQueries(["enrolledCourses"]);
      queryClient.invalidateQueries(["exploreCourses"]);
    },
    onError: (e) => toast.error(e.response?.data || "Enrollment failed"),
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out!");
    navigate("/login");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (dashLoading && activeTab === "dashboard") {
    return (
      <div className="ls-loading-screen">
        <div className="ls-spinner"></div>
        <span>Loading your workspace...</span>
      </div>
    );
  }

  return (
    <div className="ls-app">
      {/* Sidebar */}
      <aside className="ls-sidebar">
        <div className="ls-sidebar-header">
          <div className="ls-logo">
            <Sparkles size={20} />
            <span>LearnSphear</span>
          </div>
          <div className="ls-user-avatar">
            <div className="ls-avatar-circle">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="ls-user-info">
              <span className="ls-user-name">{user?.username}</span>
              <span className="ls-user-role">Student</span>
            </div>
          </div>
          <div className="ls-xp-bar-mini">
            <Flame size={12} className="ls-flame" />
            <span>{dashboard?.xp || 0} XP</span>
          </div>
        </div>

        <nav className="ls-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`ls-nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {tab.id === "notifications" && unreadCount > 0 && (
                <span className="ls-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>

        <button className="ls-logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ls-main">
        {/* ═══════════════════════════════════════════════════════════
            DASHBOARD TAB
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "dashboard" && (
          <div className="ls-content">
            <div className="ls-page-header">
              <div>
                <h1>Welcome back, {user?.username}! 👋</h1>
                <p>Here's your learning progress overview.</p>
              </div>
              <button className="ls-btn-primary" onClick={() => setActiveTab("explore")}>
                <Compass size={16} /> Explore Courses
              </button>
            </div>

            {/* Stats Cards */}
            <div className="ls-stats-grid">
              <div className="ls-stat-card ls-stat-purple">
                <div className="ls-stat-icon"><BookOpen size={22} /></div>
                <div className="ls-stat-info">
                  <span className="ls-stat-num">{dashboard?.enrolledCoursesCount || 0}</span>
                  <span className="ls-stat-label">Enrolled Courses</span>
                </div>
              </div>
              <div className="ls-stat-card ls-stat-green">
                <div className="ls-stat-icon"><CheckCircle2 size={22} /></div>
                <div className="ls-stat-info">
                  <span className="ls-stat-num">{dashboard?.completedCoursesCount || 0}</span>
                  <span className="ls-stat-label">Completed</span>
                </div>
              </div>
              <div className="ls-stat-card ls-stat-orange">
                <div className="ls-stat-icon"><Flame size={22} /></div>
                <div className="ls-stat-info">
                  <span className="ls-stat-num">{dashboard?.streak || 0}</span>
                  <span className="ls-stat-label">Day Streak</span>
                </div>
              </div>
              <div className="ls-stat-card ls-stat-blue">
                <div className="ls-stat-icon"><Medal size={22} /></div>
                <div className="ls-stat-info">
                  <span className="ls-stat-num">{dashboard?.xp || 0}</span>
                  <span className="ls-stat-label">Total XP</span>
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            {enrolledCourses.length > 0 && (
              <div className="ls-section">
                <div className="ls-section-header">
                  <h2><TrendingUp size={18} /> Continue Learning</h2>
                  <button onClick={() => setActiveTab("my-courses")} className="ls-link-btn">
                    View all <ChevronRight size={14} />
                  </button>
                </div>
                <div className="ls-courses-row">
                  {enrolledCourses.slice(0, 3).map((enrollment) => (
                    <div key={enrollment.enrollmentId} className="ls-course-card-sm">
                      <div className="ls-course-thumb" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                        {enrollment.thumbnailUrl
                          ? <img src={enrollment.thumbnailUrl} alt={enrollment.courseTitle} />
                          : <BookOpen size={32} className="ls-thumb-icon" />
                        }
                      </div>
                      <div className="ls-course-card-body">
                        <h4>{enrollment.courseTitle}</h4>
                        <p>{enrollment.trainerName}</p>
                        <div className="ls-progress-bar-wrap">
                          <div className="ls-progress-bar">
                            <div className="ls-progress-fill" style={{ width: `${enrollment.progressPercentage}%` }} />
                          </div>
                          <span>{enrollment.progressPercentage}%</span>
                        </div>
                        <button
                          className="ls-btn-primary ls-btn-sm"
                          onClick={() => navigate(`/course/${enrollment.courseId}/play`)}
                        >
                          <Play size={13} /> Continue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Notifications */}
            {notifications.length > 0 && (
              <div className="ls-section">
                <h2><Bell size={18} /> Recent Alerts</h2>
                <div className="ls-notif-list">
                  {notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className={`ls-notif-item ${!n.isRead ? "unread" : ""}`}>
                      <div className="ls-notif-dot" />
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            MY COURSES TAB
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "my-courses" && (
          <div className="ls-content">
            <div className="ls-page-header">
              <div>
                <h1>My Courses</h1>
                <p>{enrolledCourses.length} enrolled courses</p>
              </div>
              <button className="ls-btn-primary" onClick={() => setActiveTab("explore")}>
                <Compass size={16} /> Explore More
              </button>
            </div>

            {coursesLoading ? (
              <div className="ls-loading-inline"><div className="ls-spinner-sm"></div></div>
            ) : enrolledCourses.length === 0 ? (
              <div className="ls-empty-state">
                <BookOpen size={48} />
                <h3>No courses yet</h3>
                <p>Start your learning journey by exploring courses.</p>
                <button className="ls-btn-primary" onClick={() => setActiveTab("explore")}>
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="ls-courses-grid">
                {enrolledCourses
                  .filter(e => e.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((enrollment) => (
                  <div key={enrollment.enrollmentId} className="ls-enrolled-card">
                    <div className="ls-enrolled-thumb">
                      {enrollment.thumbnailUrl
                        ? <img src={enrollment.thumbnailUrl} alt={enrollment.courseTitle} />
                        : <div className="ls-thumb-placeholder"><BookOpen size={36} /></div>
                      }
                      {enrollment.completed && (
                        <div className="ls-completed-badge"><CheckCircle2 size={16} /> Completed</div>
                      )}
                    </div>
                    <div className="ls-enrolled-body">
                      <span className="ls-course-tag">{enrollment.category}</span>
                      <h3>{enrollment.courseTitle}</h3>
                      <p className="ls-trainer-name">By {enrollment.trainerName}</p>

                      <div className="ls-progress-section">
                        <div className="ls-progress-bar">
                          <div className="ls-progress-fill" style={{ width: `${enrollment.progressPercentage}%` }} />
                        </div>
                        <div className="ls-progress-meta">
                          <span>{enrollment.progressPercentage}% complete</span>
                          <span>{enrollment.completedLessons}/{enrollment.totalLessons} lessons</span>
                        </div>
                      </div>

                      <div className="ls-card-actions">
                        <button
                          className="ls-btn-primary"
                          onClick={() => navigate(`/course/${enrollment.courseId}/play`)}
                        >
                          <Play size={14} />
                          {enrollment.progressPercentage === 0 ? "Start Learning" : "Continue"}
                        </button>
                        {enrollment.certificateGenerated && (
                          <button
                            className="ls-btn-outline"
                            onClick={() => setActiveTab("certificates")}
                          >
                            <Award size={14} /> View Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            EXPLORE TAB
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "explore" && (
          <div className="ls-content">
            <div className="ls-page-header">
              <div>
                <h1>Explore Courses</h1>
                <p>Discover new skills and courses</p>
              </div>
            </div>

            {/* Filters */}
            <div className="ls-filters-bar">
              <div className="ls-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={exploreSearch}
                  onChange={(e) => setExploreSearch(e.target.value)}
                />
              </div>
              <div className="ls-filter-chips">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    className={`ls-chip ${exploreCategory === c ? "active" : ""}`}
                    onClick={() => setExploreCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="ls-filter-chips">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    className={`ls-chip ${exploreLevel === l ? "active" : ""}`}
                    onClick={() => setExploreLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {exploreData.length === 0 ? (
              <div className="ls-empty-state">
                <Compass size={48} />
                <h3>No courses found</h3>
                <p>Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="ls-explore-grid">
                {exploreData.map((course) => (
                  <div key={course.id} className="ls-explore-card">
                    <div className="ls-explore-thumb">
                      {course.thumbnailUrl
                        ? <img src={course.thumbnailUrl} alt={course.title} />
                        : <div className="ls-thumb-gradient"><BookOpen size={32} /></div>
                      }
                      <button
                        className={`ls-wishlist-btn ${course.isWishlisted ? "wishlisted" : ""}`}
                        onClick={() => wishlistMutation.mutate({ courseId: course.id, isWishlisted: course.isWishlisted })}
                      >
                        <Heart size={16} fill={course.isWishlisted ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="ls-explore-body">
                      <div className="ls-explore-meta">
                        <span className="ls-tag ls-tag-level">{course.level}</span>
                        <span className="ls-tag ls-tag-cat">{course.category}</span>
                      </div>
                      <h3>{course.title}</h3>
                      {course.subtitle && <p className="ls-subtitle">{course.subtitle}</p>}
                      <p className="ls-trainer">By {course.trainerName}</p>
                      <div className="ls-course-stats">
                        <span><Star size={12} fill="#f59e0b" color="#f59e0b" /> {course.averageRating?.toFixed(1) || "New"}</span>
                        <span><BookMarked size={12} /> {course.totalLessons} lessons</span>
                        <span><Clock size={12} /> {course.totalDuration}h</span>
                      </div>
                      <div className="ls-price-row">
                        <div>
                          {course.discount > 0 ? (
                            <>
                              <span className="ls-price">₹{(course.price * (1 - course.discount / 100)).toFixed(0)}</span>
                              <span className="ls-price-original">₹{course.price}</span>
                            </>
                          ) : (
                            <span className="ls-price">{course.price === 0 ? "Free" : `₹${course.price}`}</span>
                          )}
                        </div>
                        {course.isEnrolled ? (
                          <button
                            className="ls-btn-outline"
                            onClick={() => navigate(`/course/${course.id}/play`)}
                          >
                            <Play size={13} /> Continue
                          </button>
                        ) : (
                          <button
                            className="ls-btn-primary"
                            onClick={() => enrollMutation.mutate(course.id)}
                            disabled={enrollMutation.isPending}
                          >
                            {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            ASSIGNMENTS TAB
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "assignments" && (
          <div className="ls-content">
            <div className="ls-page-header">
              <div>
                <h1>Assignments</h1>
                <p>Complete assignments from your enrolled courses</p>
              </div>
            </div>

            {assignments.length === 0 ? (
              <div className="ls-empty-state">
                <ClipboardCheck size={48} />
                <h3>No assignments yet</h3>
                <p>Assignments from your enrolled courses will appear here.</p>
              </div>
            ) : (
              <div className="ls-assignments-grid">
                {assignments.map((a) => {
                  const statusColor = {
                    "NOT_SUBMITTED": "#6b7280",
                    "SUBMITTED": "#3b82f6",
                    "GRADED": "#10b981",
                    "RESUBMITTED": "#f59e0b",
                  }[a.submissionStatus] || "#6b7280";
                  return (
                    <div key={a.id} className="ls-assignment-card">
                      <div className="ls-assignment-header">
                        <span className="ls-course-tag">{a.courseTitle}</span>
                        <span className="ls-status-pill" style={{ background: statusColor + "22", color: statusColor }}>
                          {a.submissionStatus?.replace("_", " ")}
                        </span>
                      </div>
                      <h3>{a.title}</h3>
                      <p className="ls-assignment-desc">{a.description}</p>
                      <div className="ls-assignment-meta">
                        <span><Clock size={13} /> {a.deadlineDays} days deadline</span>
                        <span><Target size={13} /> {a.maxMarks} marks</span>
                      </div>
                      {a.grade != null && (
                        <div className="ls-grade-chip">
                          Score: {a.grade}/{a.maxMarks}
                          {a.feedback && <p className="ls-feedback">"{a.feedback}"</p>}
                        </div>
                      )}
                      {a.submissionStatus !== "GRADED" && (
                        <button
                          className="ls-btn-primary ls-btn-sm"
                          onClick={() => { setSelectedAssignment(a); setShowAssignmentModal(true); }}
                        >
                          {a.submissionStatus === "NOT_SUBMITTED" ? "Submit Assignment" : "Resubmit"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            PROJECTS TAB
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "projects" && (
          <div className="ls-content">
            <div className="ls-page-header">
              <div>
                <h1>Projects</h1>
                <p>Capstone projects from your enrolled courses</p>
              </div>
            </div>
            {projects.length === 0 ? (
              <div className="ls-empty-state">
                <FolderGit2 size={48} />
                <h3>No projects yet</h3>
                <p>Projects will be assigned once you enroll in courses.</p>
              </div>
            ) : (
              <div className="ls-projects-grid">
                {projects.map((project) => {
                  const submission = submissions.find(s => s.project?.id === project.id);
                  return (
                    <div key={project.id} className="ls-project-card">
                      <div className="ls-project-header">
                        <span className={`ls-difficulty-tag ls-diff-${project.difficulty?.toLowerCase()}`}>
                          {project.difficulty}
                        </span>
                        {submission && (
                          <span className="ls-project-status">{submission.status}</span>
                        )}
                      </div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="ls-project-meta">
                        <span><Clock size={13} /> {project.deadlineDays} days</span>
                        <span><Target size={13} /> {project.maxScore} points</span>
                        {project.githubRequired && <span className="ls-github-required">GitHub Required</span>}
                      </div>
                      {submission?.rubric && <p className="ls-rubric">Rubric: {project.rubric}</p>}
                      {submission?.score != null && (
                        <div className="ls-grade-chip">
                          Score: {submission.score}/{project.maxScore}
                          {submission.feedback && <p className="ls-feedback">"{submission.feedback}"</p>}
                        </div>
                      )}
                      <button
                        className="ls-btn-primary ls-btn-sm"
                        onClick={() => { setSelectedProject(project); setShowProjectModal(true); }}
                      >
                        <FolderGit2 size={13} />
                        {submission ? "Update Submission" : "Submit Project"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            CERTIFICATES TAB
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "certificates" && (
          <div className="ls-content">
            <div className="ls-page-header">
              <div>
                <h1>My Certificates</h1>
                <p>Your earned completion certificates</p>
              </div>
            </div>
            {certificates.length === 0 ? (
              <div className="ls-empty-state">
                <Award size={48} />
                <h3>No certificates yet</h3>
                <p>Complete a course to earn your first certificate!</p>
              </div>
            ) : (
              <div className="ls-certs-grid">
                {certificates.map((cert) => (
                  <div key={cert.id} className="ls-cert-card">
                    <div className="ls-cert-icon">
                      <GraduationCap size={40} />
                    </div>
                    <div className="ls-cert-body">
                      <h3>{cert.courseTitle}</h3>
                      <p>Instructor: {cert.trainerName}</p>
                      <p className="ls-cert-date">
                        Issued: {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <button className="ls-btn-outline ls-btn-sm">
                      <Award size={13} /> Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            WISHLIST TAB
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "wishlist" && (
          <div className="ls-content">
            <div className="ls-page-header">
              <div>
                <h1>Wishlist</h1>
                <p>Courses you've saved for later</p>
              </div>
            </div>
            {wishlist.length === 0 ? (
              <div className="ls-empty-state">
                <Heart size={48} />
                <h3>Your wishlist is empty</h3>
                <p>Save courses you're interested in for later.</p>
                <button className="ls-btn-primary" onClick={() => setActiveTab("explore")}>
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="ls-explore-grid">
                {wishlist.map((course) => (
                  <div key={course.id} className="ls-explore-card">
                    <div className="ls-explore-thumb">
                      <div className="ls-thumb-gradient"><BookOpen size={32} /></div>
                      <button
                        className="ls-wishlist-btn wishlisted"
                        onClick={() => wishlistMutation.mutate({ courseId: course.id, isWishlisted: true })}
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                    <div className="ls-explore-body">
                      <h3>{course.title}</h3>
                      <p>{course.trainerName}</p>
                      <div className="ls-price-row">
                        <span className="ls-price">₹{course.price}</span>
                        <button className="ls-btn-primary" onClick={() => enrollMutation.mutate(course.id)}>
                          Enroll Now
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
            NOTIFICATIONS TAB
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "notifications" && (
          <div className="ls-content">
            <div className="ls-page-header">
              <div>
                <h1>Notifications</h1>
                <p>{unreadCount} unread alerts</p>
              </div>
              {unreadCount > 0 && (
                <button className="ls-btn-outline" onClick={() => markReadMutation.mutate()}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="ls-notif-full-list">
              {notifications.length === 0 ? (
                <div className="ls-empty-state">
                  <Bell size={48} />
                  <h3>No notifications</h3>
                </div>
              ) : notifications.map((n) => (
                <div key={n.id} className={`ls-notif-full-item ${!n.isRead ? "unread" : ""}`}>
                  <div className="ls-notif-dot" />
                  <div className="ls-notif-content">
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    <span className="ls-notif-time">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ══ PROJECT MODAL ══ */}
      {showProjectModal && selectedProject && (
        <div className="ls-modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="ls-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Submit: {selectedProject.title}</h2>
            <p className="ls-modal-desc">{selectedProject.description}</p>
            <div className="ls-form-group">
              <label>GitHub URL {selectedProject.githubRequired && <span className="ls-required">*</span>}</label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={projectForm.githubUrl}
                onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
              />
            </div>
            <div className="ls-form-group">
              <label>Live Demo URL (optional)</label>
              <input
                type="url"
                placeholder="https://your-demo.vercel.app"
                value={projectForm.liveDemo}
                onChange={(e) => setProjectForm({ ...projectForm, liveDemo: e.target.value })}
              />
            </div>
            <div className="ls-form-group">
              <label>Notes</label>
              <textarea
                rows={3}
                placeholder="Add any notes about your submission..."
                value={projectForm.notes}
                onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })}
              />
            </div>
            <div className="ls-modal-actions">
              <button className="ls-btn-outline" onClick={() => setShowProjectModal(false)}>Cancel</button>
              <button
                className="ls-btn-primary"
                disabled={projectMutation.isPending}
                onClick={() => projectMutation.mutate({
                  projectId: selectedProject.id,
                  ...projectForm,
                })}
              >
                {projectMutation.isPending ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ASSIGNMENT MODAL ══ */}
      {showAssignmentModal && selectedAssignment && (
        <div className="ls-modal-overlay" onClick={() => setShowAssignmentModal(false)}>
          <div className="ls-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Submit: {selectedAssignment.title}</h2>
            <p className="ls-modal-desc">{selectedAssignment.description}</p>
            <div className="ls-form-group">
              <label>Your Answer</label>
              <textarea
                rows={5}
                placeholder="Write your assignment answer here..."
                value={assignmentText}
                onChange={(e) => setAssignmentText(e.target.value)}
              />
            </div>
            <div className="ls-modal-actions">
              <button className="ls-btn-outline" onClick={() => setShowAssignmentModal(false)}>Cancel</button>
              <button
                className="ls-btn-primary"
                disabled={assignmentMutation.isPending}
                onClick={() => assignmentMutation.mutate({
                  assignmentId: selectedAssignment.id,
                  submissionText: assignmentText,
                  fileUrl: null,
                })}
              >
                {assignmentMutation.isPending ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mylearning;