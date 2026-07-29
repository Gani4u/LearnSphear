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
  Clock,
  ExternalLink
} from "lucide-react";
import {
  fetchCourseDetail,
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
    queryFn: () => fetchCourseDetail(courseId),
    enabled: !!courseId,
  });

  const { data: completedLessons, refetch: refetchCompleted } = useQuery({
    queryKey: ["completedLessons", courseId],
    queryFn: () => fetchCompletedLessons(courseId),
    enabled: !!courseId,
  });

  // Flattened lessons helper
  const allLessons = course?.sections
    ? course.sections.flatMap(sec => 
        (sec.lessons || []).map(l => ({ ...l, sectionTitle: sec.title }))
      ).sort((a, b) => a.sequence - b.sequence)
    : [];

  // Set first lesson as active once loaded
  if (allLessons.length > 0 && !activeLesson) {
    setActiveLesson(allLessons[0]);
  }

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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-indigo-500" size={36} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-red-500 font-bold">Error loading classroom: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans text-slate-200">
      
      {/* HEADER BANNER */}
      <header className="bg-[#111827] border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-left">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Classroom Player</span>
            <h1 className="text-base font-extrabold tracking-tight text-white">{course.title}</h1>
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
                src={activeLesson.videoUrl.startsWith('http') ? activeLesson.videoUrl : `http://localhost:8080/videos/${activeLesson.videoUrl}`}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8 space-y-3">
                <Play size={48} className="text-indigo-500 mx-auto fill-indigo-500 animate-pulse" />
                <div>
                  <h4 className="text-white font-bold text-lg">{activeLesson?.title || "Welcome to Classroom"}</h4>
                  <p className="text-xs text-slate-400">Mocking educational playback screen</p>
                </div>
              </div>
            )}
            
            {/* Float Mark Complete on top right of video player */}
            {activeLesson && (
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleMarkComplete}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>Mark Lesson Complete</span>
                </button>
              </div>
            )}
          </div>

          {/* Classroom Tabs */}
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="flex gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
              {["overview", "lesson", "notes", "resources", "discussion"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-[#111827] text-white border border-slate-700"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800/80 shadow-sm text-left">
              
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-white text-lg">Course Overview</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{course.description}</p>
                </div>
              )}

              {activeTab === "lesson" && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                    <span>{activeLesson?.title}</span>
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                    {activeLesson?.description || "No lecture notes written for this lesson yet."}
                  </p>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-white text-base">Personal Lecture Notes</h3>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Auto-synced</span>
                  </div>

                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a note matching this timestamp..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500">
                      Save
                    </button>
                  </form>

                  <div className="space-y-3">
                    {notes?.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-start gap-3">
                        <Bookmark size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                          <p className="text-xs text-slate-300 font-medium">{n.note}</p>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Timestamp: {n.videoTimestamp}s</span>
                        </div>
                      </div>
                    ))}
                    {(!notes || notes.length === 0) && (
                      <p className="text-xs text-slate-500 text-center py-4">No notes saved for this lesson yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-white text-base">Lesson Materials</h3>
                  {activeLesson?.resourcesUrl ? (
                    <div className="py-3 flex justify-between items-center bg-slate-900/50 border border-slate-800 rounded-xl px-4">
                      <div className="flex items-center gap-2.5">
                        <FileText className="text-slate-400" size={18} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">Resources Attachment Link</h4>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">External File</span>
                        </div>
                      </div>
                      <a
                        href={activeLesson.resourcesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-indigo-400 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-4">No resources attachments for this lesson.</p>
                  )}
                </div>
              )}

              {activeTab === "discussion" && (
                <div className="space-y-6">
                  <h3 className="font-extrabold text-white text-base">Classroom Forum</h3>
                  
                  <form onSubmit={handleAddDiscussion} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask a question or discuss this lesson..."
                      value={discussionText}
                      onChange={(e) => setDiscussionText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                    <button type="submit" className="p-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl">
                      <Send size={14} />
                    </button>
                  </form>

                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {discussions?.map((disc) => (
                      <div key={disc.id} className="flex gap-3 text-left">
                        <div className="w-8 h-8 rounded-lg bg-slate-850 border border-slate-850 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
                          {disc.student?.username?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-200">{disc.student?.username}</span>
                            <span className="text-[9px] text-slate-500">{new Date(disc.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-normal">{disc.message}</p>
                        </div>
                      </div>
                    ))}
                    {(!discussions || discussions.length === 0) && (
                      <p className="text-xs text-slate-500 text-center py-4">Be the first to post a discussion message!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Side: Chapter & Lessons Sidebar */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#111827] p-6 flex flex-col gap-6 shrink-0 text-left overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Course Content</span>
            <h3 className="font-extrabold text-white text-base">Chapters & Lessons</h3>
          </div>

          <div className="space-y-4">
            {course?.sections?.map((section) => (
              <div key={section.id} className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  {section.title}
                </h4>
                <div className="flex flex-col gap-1.5">
                  {(section.lessons || []).map((lesson) => {
                    const isActive = activeLesson?.id === lesson.id;
                    const isCompleted = completedLessons?.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson({ ...lesson, sectionTitle: section.title })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isActive
                            ? "border-indigo-500 bg-indigo-500/5 shadow-sm"
                            : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 size={13} className="text-emerald-500 fill-emerald-50" />
                            ) : isActive ? (
                              <Play size={13} className="text-indigo-500 fill-indigo-500" />
                            ) : (
                              <Circle size={13} className="text-slate-650" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h5 className={`text-xs font-bold ${isActive ? 'text-indigo-400' : 'text-slate-300'}`}>
                              {lesson.title}
                            </h5>
                            <span className="text-[9px] text-slate-500 flex items-center gap-1">
                              <Clock size={10} />
                              <span>{lesson.duration || 10} Mins</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
