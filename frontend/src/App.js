import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import { Topbar } from "./layout/Topbar";
import { Home } from "./components/Home";
import { Mycourse } from "./trainer/Mycourse";
import { Mylearning } from "./student/Mylearning";
import { Profile } from "./components/Profile";
import { Rolebaseroute } from "./auth/Rolebaseroute";
import { AddLesson } from "./trainer/components/AddLesson";
import { ViewLesson } from "./trainer/components/ViewLesson";
import { CourseDetail } from "./components/CourseDetail";
import { CoursePlayer } from "./student/components/CoursePlayer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/register" element={<LandingPage />} />

        <Route
          path="course/:courseId/play"
          element={
            <Rolebaseroute roleallowed={["STUDENT"]}>
              <CoursePlayer />
            </Rolebaseroute>
          }
        />

        <Route
          path="mylearning"
          element={
            <Rolebaseroute roleallowed={["STUDENT"]}>
              <Mylearning />
            </Rolebaseroute>
          }
        />

        <Route
          path="myclass"
          element={
            <Rolebaseroute roleallowed={["TRAINER"]}>
              <Mycourse />
            </Rolebaseroute>
          }
        />

        <Route element={<Topbar />}>
          <Route
            path="home"
            element={
              <Rolebaseroute roleallowed={["STUDENT", "TRAINER"]}>
                <Home />
              </Rolebaseroute>
            }
          />
          <Route
            path="addlesson/:courseid"
            element={
              <Rolebaseroute roleallowed="TRAINER">
                <AddLesson />
              </Rolebaseroute>
            }
          />
          <Route
            path="viewlesson/:courseid"
            element={
              <Rolebaseroute roleallowed="TRAINER">
                <ViewLesson />
              </Rolebaseroute>
            }
          />
          <Route
            path="profile"
            element={
              <Rolebaseroute roleallowed={["STUDENT", "TRAINER"]}>
                <Profile />
              </Rolebaseroute>
            }
          />
          <Route
            path="course/:courseId"
            element={
              <Rolebaseroute roleallowed={["STUDENT", "TRAINER"]}>
                <CourseDetail />
              </Rolebaseroute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
