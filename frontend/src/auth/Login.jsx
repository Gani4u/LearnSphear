import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../Api/useLogin";
import { loginSuccess } from "../store/AuthSlice";
import { Button } from "../components/ui/button";
import { User, Lock, ArrowRight } from "lucide-react";

export const Login = ({ onSuccess, onSwitch }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isFocused, setIsFocused] = useState({ username: false, password: false });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(formData, {
      onSuccess: (data) => {
        dispatch(loginSuccess(data));
        onSuccess?.();
        navigate(data.user.role === "STUDENT" ? "/mylearning" : "/myclass");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3.5 bg-red-50/80 border border-red-100 rounded-xl text-red-600 text-xs font-medium flex items-center gap-2 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          {error.message || "Invalid credentials. Please try again."}
        </div>
      )}

      {/* Username Input */}
      <div className="space-y-1.5">
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
            className="w-full pl-10 pr-4 py-3 bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
            placeholder="Enter your username"
            name="username"
            onFocus={() => setIsFocused({ ...isFocused, username: true })}
            onBlur={() => setIsFocused({ ...isFocused, username: false })}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Password</label>
          <span className="text-xs text-blue-600 hover:underline cursor-pointer font-medium">Forgot?</span>
        </div>
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
            className="w-full pl-10 pr-4 py-3 bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
            type="password"
            placeholder="••••••••"
            name="password"
            onFocus={() => setIsFocused({ ...isFocused, password: true })}
            onBlur={() => setIsFocused({ ...isFocused, password: false })}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Action Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <span>Log In</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>

      {/* Register Link */}
      <p className="text-center text-sm text-slate-500 pt-1">
        New to LearnSpear?{" "}
        <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={onSwitch}>
          Create an account
        </span>
      </p>
    </form>
  );
};