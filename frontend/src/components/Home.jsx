import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StudentHome from "../student/components/StudentHome";

export const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === "TRAINER") {
      navigate("/myclass", { replace: true });
    }
  }, [user, navigate]);

  if (user && user.role === "TRAINER") {
    return null;
  }

  return (
    <>
      {user && user.role === "STUDENT" && <StudentHome />}
    </>
  );
};