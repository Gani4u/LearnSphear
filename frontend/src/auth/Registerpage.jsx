import { useState } from "react";
import { useRegister } from "../Api/UserRegister";
import { Button } from "../components/ui/button";
import { User, Mail, Lock, GraduationCap, Presentation, ArrowRight, Check } from "lucide-react";

export const Registerpage = ({ onSuccess, onSwitch }) => {
  const { mutate, isPending, error } = useRegister();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [isFocused, setIsFocused] = useState({
    username: false,
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.role) {
      alert("Please select a role to register.");
      return;
    }
    mutate(formData, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 bg-red-50/80 border border-red-100 rounded-xl text-red-600 text-xs font-medium flex items-center gap-2 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          {error.message || "Registration failed. Please check your inputs."}
        </div>
      )}

      {/* Username */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Username</label>
        <div
          className={`relative flex items-center rounded-xl border transition-all duration-200 bg-slate-50/50 ${
            isFocused.username
              ? "border-blue-500 ring-2 ring-blue-500/15 bg-white shadow-sm"
              : "border-slate-200"
          }`}
        >
          <div className="absolute left-3.5 text-slate-400">
            <User size={18} className={isFocused.username ? "text-blue-500" : ""} />
          </div>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
            placeholder="Choose username"
            name="username"
            onFocus={() => setIsFocused({ ...isFocused, username: true })}
            onBlur={() => setIsFocused({ ...isFocused, username: false })}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email</label>
        <div
          className={`relative flex items-center rounded-xl border transition-all duration-200 bg-slate-50/50 ${
            isFocused.email
              ? "border-blue-500 ring-2 ring-blue-500/15 bg-white shadow-sm"
              : "border-slate-200"
          }`}
        >
          <div className="absolute left-3.5 text-slate-400">
            <Mail size={18} className={isFocused.email ? "text-blue-500" : ""} />
          </div>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
            type="email"
            placeholder="yourname@domain.com"
            name="email"
            onFocus={() => setIsFocused({ ...isFocused, email: true })}
            onBlur={() => setIsFocused({ ...isFocused, email: false })}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Password</label>
        <div
          className={`relative flex items-center rounded-xl border transition-all duration-200 bg-slate-50/50 ${
            isFocused.password
              ? "border-blue-500 ring-2 ring-blue-500/15 bg-white shadow-sm"
              : "border-slate-200"
          }`}
        >
          <div className="absolute left-3.5 text-slate-400">
            <Lock size={18} className={isFocused.password ? "text-blue-500" : ""} />
          </div>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
            type="password"
            placeholder="Min 6 characters"
            name="password"
            onFocus={() => setIsFocused({ ...isFocused, password: true })}
            onBlur={() => setIsFocused({ ...isFocused, password: false })}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Role Card Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">I want to join as</label>
        <div className="grid grid-cols-2 gap-3">
          {/* Student Role */}
          <div
            onClick={() => selectRole("STUDENT")}
            className={`p-3.5 rounded-xl border-2 cursor-pointer flex flex-col items-center text-center transition-all duration-200 ${
              formData.role === "STUDENT"
                ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/10 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`p-2 rounded-lg mb-2 transition-colors ${
                formData.role === "STUDENT" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              <GraduationCap size={20} />
            </div>
            <span className={`text-sm font-bold block ${formData.role === "STUDENT" ? "text-blue-900" : "text-slate-700"}`}>
              Student
            </span>
            <span className="text-[10px] text-slate-400 mt-1 leading-normal">
              Enroll in classes & study
            </span>
            {formData.role === "STUDENT" && (
              <div className="mt-2 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Check size={10} strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Trainer Role */}
          <div
            onClick={() => selectRole("TRAINER")}
            className={`p-3.5 rounded-xl border-2 cursor-pointer flex flex-col items-center text-center transition-all duration-200 ${
              formData.role === "TRAINER"
                ? "border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/10 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div
              className={`p-2 rounded-lg mb-2 transition-colors ${
                formData.role === "TRAINER" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              <Presentation size={20} />
            </div>
            <span className={`text-sm font-bold block ${formData.role === "TRAINER" ? "text-blue-900" : "text-slate-700"}`}>
              Trainer
            </span>
            <span className="text-[10px] text-slate-400 mt-1 leading-normal">
              Deliver courses & tutor
            </span>
            {formData.role === "TRAINER" && (
              <div className="mt-2 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Check size={10} strokeWidth={3} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <span>Get Started</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-slate-500 pt-1">
        Already have an account?{" "}
        <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={onSwitch}>
          Login
        </span>
      </p>
    </form>
  );
};