// authpage/Rolebaseroute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const Rolebaseroute = ({ children, roleallowed }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !user.role) {
    return <Navigate to="/login" replace state={{ message: "Please login first..!" }} />;
  }

  // ✅ Check if the roleallowed is an array
  if (Array.isArray(roleallowed)) {
    if (!roleallowed.includes(user.role)) {
      return <Navigate to="/" replace state={{ message: "Access denied: unauthorized role" }} />;
    }
  } else {
    // Single role fallback
    if (user.role !== roleallowed) {
      return <Navigate to="/" replace state={{ message: "Access denied: unauthorized role" }} />;
    }
  }

  return children;
};
