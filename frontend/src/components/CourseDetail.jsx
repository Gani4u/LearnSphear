import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCourseDetails } from "../Api/fetchCourseDetails";
import { unenrollCourse } from "../Api/unenrollCourse";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  const { data: course, isLoading, isError, error } = useQuery({
    queryKey: ["courseDetail", courseId],
    queryFn: () => fetchCourseDetails(courseId),
    enabled: !!courseId,
  });

  const unenrollMutation = useMutation({
    mutationFn: () => unenrollCourse({ studentId: user?.id, courseId }),
    onSuccess: (message) => {
      toast.success(message || "Unenrolled successfully", { theme: "dark" });
      queryClient.invalidateQueries(["courses"]);
      navigate("/mylearning");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to unenroll", { theme: "dark" });
    },
  });

  const isTrainerOwner = useMemo(() => {
    return role === "TRAINER" && course?.trainerName === user?.username;
  }, [course, role, user]);

  const handleUnenroll = () => {
    if (!user?.id) return;
    unenrollMutation.mutate();
  };

  const handleAddLesson = () => {
    navigate(`/addlesson/${courseId}`);
  };

  const handleViewLesson = (sequence) => {
    // Simple scroll to lesson section or open modal in future.
    const el = document.getElementById(`lesson-${sequence}`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) return <p>Loading course details...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="container my-5">
      <div className="course-detail">
        <div className="course-detail__header">
          <img
            className="course-detail__cover"
            src={course.imageUrl ? `http://localhost:8080/images/${course.imageUrl}` : "https://picsum.photos/seed/course/900/320"}
            alt={course.title}
          />
          <div className="course-detail__header-body">
            <h1 className="course-detail__title">{course.title}</h1>
            <p className="course-detail__description">{course.description}</p>
            <p className="course-detail__meta">
              <span className="badge">Trainer: {course.trainerName ?? "—"}</span>
              <span className="badge">Lessons: {course.lessons?.length ?? 0}</span>
            </p>
            <div className="course-detail__actions">
              {role === "STUDENT" && (
                <button className="btn btn-primary" onClick={handleUnenroll}>
                  {unenrollMutation.isLoading ? "Unenrolling..." : "Unenroll"}
                </button>
              )}

              {isTrainerOwner && (
                <button className="btn btn-secondary" onClick={handleAddLesson}>
                  Add Lesson
                </button>
              )}

              <button className="btn btn-outline" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </div>
        </div>

        <section className="section">
          <h2 className="mb-3">Lessons</h2>
          <div className="lesson-grid">
            {course.lessons?.length ? (
              course.lessons
                .slice()
                .sort((a, b) => a.sequence - b.sequence)
                .map((lesson) => (
                  <article className="lesson-card glass" key={lesson.sequence} id={`lesson-${lesson.sequence}`}>
                    <h3>
                      <span className="lesson-badge">{lesson.sequence}</span> {lesson.title}
                    </h3>
                    <p className="text-muted">{lesson.content?.slice(0, 150) || "No content yet."}</p>
                    <div>
                      <button className="btn btn-outline" onClick={() => handleViewLesson(lesson.sequence)}>
                        View
                      </button>
                    </div>
                  </article>
                ))
            ) : (
              <p className="text-muted">No lessons added yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
