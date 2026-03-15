import { useState } from "react";
import { useRegister } from "../Api/UserRegister";

export const Registerpage = ({ onSuccess, onSwitch }) => {
    //const dispatch = useDispatch();
const { mutate, isPending, error } = useRegister();

const [formData, setFormData] = useState({
  username: "",
  email: "",
  password: "",
  // confirmPassword: "",
  // phone: "",
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
//   if (formData.password !== formData.confirmPassword) {
//     setFormError("Passwords do not match.");
//     return;
//   }
//   if (!formData.phone.match(/^\d{10}$/)) {
//     setFormError("Enter a valid 10-digit phone number.");
//     return;
//   }
  if (!formData.role) {
    setFormError("Please select a role.");
    return;
  }

  // Call API
  mutate(formData, {
    onSuccess: (data) => {
      onSuccess?.();
    },
  });
};
  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
        <h2>Create your account</h2>

        {formError && <p className="error">{formError}</p>}
        {error && <p className="error">{error.message}</p>}

        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="STUDENT">Student</option>
          <option value="TRAINER">Instructor</option>
        </select>

        <button className="btn btn-primary" type="submit" disabled={isPending}>
          {isPending ? "Registering..." : "Register"}
        </button>

        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <button type="button" className="btn btn-secondary" onClick={onSwitch}>
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
