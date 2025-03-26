import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./Authslice";
import { useNavigate } from "react-router-dom";

export const Registerpage=()=>{
      const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(""); // Reset error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.username || formData.username.length < 5) {
      setFormError("Username must be at least 5 characters.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError("Enter a valid email.");
      return;
    }
    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      setFormError("Enter a valid 10-digit phone number.");
      return;
    }
    if (!formData.role) {
      setFormError("Please select a role.");
      return;
    }

    // Dispatch Redux action
    dispatch(registerUser(formData)).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        alert("Registration Successful!");
        navigate("/login");
      }
    });
  };
    return(
        <>
       <div>
      <h2>Register</h2>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />

        <select name="role" onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>       
        </>
    )
}