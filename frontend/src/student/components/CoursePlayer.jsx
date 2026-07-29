import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Bookmark,
  Download,
  Send,
  Loader2,
  Clock
} from "lucide-react";
import { fetchCourseDetails } from "../../Api/fetchCourseDetails";
import {
  completeLesson,
  fetchNotes,
  addNote,
  fetchDiscussions,
  addDiscussion,
  fetchCompletedLessons
} from "../../Api/studentApi";

export const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Active states
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [noteText, setNoteText] = useState("");
  const [discussionText, setDiscussionText] = useState("");

  // Queries
  const { data: course, isLoading, isError, error } = useQuery({
    queryKey: ["courseDetail", courseId],
    queryFn: () => fetchCourseDetails(courseId),
    enabled: !!courseId,
  });

  const { data: completedLessons, refetch: refetchCompleted } = useQuery({
    queryKey: ["completedLessons", courseId],
    queryFn: () => fetchCompletedLessons(courseId),
    enabled: !!courseId,
  });

  // Fetch Notes and Discussions dynamically when active lesson changes
  const activeLessonId = activeLesson?.id;

  const { data: notes, refetch: refetchNotes } = useQuery({
    queryKey: ["notes", activeLessonId],
    queryFn: () => fetchNotes(activeLessonId),
    enabled: !!activeLessonId,
  });

  const { data: discussions, refetch: refetchDiscussions } = useQuery({
    queryKey: ["discussions", activeLessonId],
    queryFn: () => fetchDiscussions(activeLessonId),
    enabled: !!activeLessonId,
  });

  // Set first lesson as active once loaded
  if (course?.lessons?.length > 0 && !activeLesson) {
    const sorted = [...course.lessons].sort((a, b) => a.sequence - b.sequence);
    setActiveLesson(sorted[0]);
  }

  // Mutations
  const completeMutation = useMutation({
    mutationFn: completeLesson,
    onSuccess: (msg) => {
      toast.success(msg || "Lesson completed!");
      refetchCompleted();
      queryClient.invalidateQueries(["courseDetail", courseId]);
      queryClient.invalidateQueries(["studentDashboard"]);
      queryClient.invalidateQueries(["enrolledCourses"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update progress");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      setNoteText("");
      refetchNotes();
    },
  });

  const addDiscussionMutation = useMutation({
    mutationFn: addDiscussion,
    onSuccess: () => {
      setDiscussionText("");
      refetchDiscussions();
    },
  });

  // Actions
  const handleMarkComplete = () => {
    if (!activeLesson) return;
    completeMutation.mutate({ courseId, lessonId: activeLesson.id });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNoteMutation.mutate({ lessonId: activeLesson.id, note: noteText, timestamp: 0 });
  };

  const handleAddDiscussion = (e) => {
    e.preventDefault();
    if (!discussionText.trim()) return;
    addDiscussionMutation.mutate({ lessonId: activeLesson.id, message: discussionText });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500 font-bold">Error loading classroom: {error.message}</p>
      </div>
    );
  }

  const sortedLessons = course?.lessons ? [...course.lessons].sort((a, b) => a.sequence - b.sequence) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER BANNER */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-left">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Classroom Player</span>
            <h1 className="text-base font-extrabold tracking-tight">{course.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-400">Instructor: {course.trainerName || "—"}</span>
        </div>
      </header>

      {/* CLASSROOM AREA */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* Left Side: Video Player & Tabs */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6 min-w-0">
          
          {/* Custom Video Player mock */}
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-3xl bg-black border border-slate-800 shadow-lg relative overflow-hidden flex items-center justify-center group">
            {activeLesson?.videoUrl ? (
              <video
                src={`http://localhost:8080/videos/${activeLesson.videoUrl}`}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <Play size={48} className="text-blue-500 mx-auto fill-blue-500 animate-pulse" />
                <div>
                  <h4 className="text-white font-bold text-lg">{activeLesson?.title || "Welcome to Classroom"}</h4>
                  <p className="text-xs text-slate-400">Mocking educational playback screen</p>
                </div>
              </div>
            )}
            
            {/* Float Mark Complete on top right of video player */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleMarkComplete}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>Mark Lesson Complete</span>
              </button>
            </div>
          </div>

          {/* Classroom Tabs */}
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex gap-1 border-b border-slate-200 pb-2 overflow-x-auto">
              {["overview", "lesson", "notes", "resources", "discussion"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-left">
              
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-lg">Course Overview</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{course.description}</p>
                </div>
              )}

              {activeTab === "lesson" && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-xs">
                      {activeLesson?.sequence}
                    </span>
                    <span>{activeLesson?.title}</span>
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                    {activeLesson?.content || "No lecture notes written for this lesson yet."}
                  </p>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-base">Personal Lecture Notes</h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Auto-synced</span>
                  </div>

                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a note matching this timestamp..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                    <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800">
                      Save
                    </button>
                  </form>

                  <div className="space-y-3">
                    {notes?.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                        <Bookmark size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                          <p className="text-xs text-slate-700 font-medium">{n.note}</p>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Timestamp: {n.videoTimestamp}s</span>
                        </div>
                      </div>
                    ))}
                    {(!notes || notes.length === 0) && (
                      <p className="text-xs text-slate-400 text-center py-4">No notes saved for this lesson yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-base">Lesson Materials</h3>
                  <div className="divide-y divide-slate-100">
                    <div className="py-3 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <FileText className="text-slate-400" size={18} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Cheat Sheet & Source Code</h4>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">ZIP Code</span>
                        </div>
                      </div>
                      <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "discussion" && (
                <div className="space-y-6">
                  <h3 className="font-extrabold text-slate-800 text-base">Classroom Forum</h3>
                  
                  <form onSubmit={handleAddDiscussion} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask a question or discuss this lesson..."
                      value={discussionText}
                      onChange={(e) => setDiscussionText(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                    <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                      <Send size={14} />
                    </button>
                  </form>

                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {discussions?.map((disc) => (
                      <div key={disc.id} className="flex gap-3 text-left">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                          {disc.student?.username?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">{disc.student?.username}</span>
                            <span className="text-[9px] text-slate-400">{new Date(disc.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-normal">{disc.message}</p>
                        </div>
                      </div>
                    ))}
                    {(!discussions || discussions.length === 0) && (
                      <p className="text-xs text-slate-400 text-center py-4">Be the first to post a discussion message!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Side: Chapter & Lessons Sidebar */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-6 flex flex-col gap-6 shrink-0 text-left overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Course Content</span>
            <h3 className="font-extrabold text-slate-800 text-base">Chapters & Lessons</h3>
          </div>

          <div className="flex flex-col gap-2">
            {sortedLessons.map((lesson) => {
              const isActive = activeLesson?.id === lesson.id;
              const isCompleted = completedLessons?.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? "border-blue-500 bg-blue-50/20 shadow-sm"
                      : "border-slate-100 bg-slate-50/40 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50" />
                      ) : isActive ? (
                        <Play size={14} className="text-blue-600 fill-blue-600" />
                      ) : (
                        <Circle size={14} className="text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-bold ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                        {lesson.sequence}. {lesson.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} />
                        <span>{lesson.duration || 10} Mins</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};
