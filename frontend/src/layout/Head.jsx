import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export const Head = () => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return (
    <header className="site-nav" style={{ position: 'relative', top: 0 }}>
      <div className="brand">LearnSpear</div>
      <div className="nav-links">
        <NavLink className="nav-link" to="home">
          Home
        </NavLink>
        <NavLink className="nav-link" to={role === "STUDENT" ? "/mylearning" : "/myclass"}>
          {role === "STUDENT" ? "My Learning" : "My Courses"}
        </NavLink>
      </div>
    </header>
  );
};
