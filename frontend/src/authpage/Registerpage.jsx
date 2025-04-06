import { useState } from "react";
//import { useDispatch } from "react-redux";
import { useRegister } from "../Api/UserRegister";

import { useNavigate } from "react-router-dom";
//import { loginSuccess } from "../store/AuthSlice";
import '../pages/csspages/registerpagestyle.css'

export const Registerpage=()=>{
    //const dispatch = useDispatch();
const navigate = useNavigate();
const { mutate, isPending, error } = useRegister();

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
  setFormError("");
};

const handleSubmit = (e) => {
  e.preventDefault();

  // Basic validation
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

  // Call API
  mutate(formData, {
    onSuccess: (data) => {
      //dispatch(loginSuccess({ user: data.user, token: data.token }));  this line is used to send data to redux store
      alert("Registration Successful!");
      navigate("/login");
    },
  });
};
    return(
        <>
          
        <div className="reg-container">
      <h2>Register</h2>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
      {error && <p style={{ color: "red" }}>{error.message}</p>}

      <form className="classform" onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Re-enter Password" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <select name="role" onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <button type="submit" disabled={isPending}>
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>
    </div>   
        </>
    )
}