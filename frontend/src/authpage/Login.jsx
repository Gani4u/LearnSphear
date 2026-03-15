import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../Api/useLogin";
import { loginSuccess } from "../store/AuthSlice";


export const Login = ({ onSuccess, onSwitch }) => {
    
    
    const navigate=useNavigate();
    const location = useLocation();
    const message = location.state?.message || "";
    const sessionExpiredMessage = location.state?.sessionExpired || "";
        const [formData,setFormData]=useState({
            username:"",
            password:""
        });
        const dispatch=useDispatch();
        const {mutate,isPending,error}=useLogin();
        const handleChange=(e)=>{
            setFormData({...formData,[e.target.name]:e.target.value});
        }
        const handlesubmit = (e) => {
            e.preventDefault();
            mutate(formData, {
                onSuccess: (data) => {
                    dispatch(loginSuccess({ user: data.user, token: data.token }));
                    onSuccess?.();
                    if (data.user.role === "STUDENT") {
                        navigate("/mylearning", { replace: true });
                    } else if (data.user.role === "TRAINER") {
                        navigate("/myclass", { replace: true });
                    }
                },
            });
        }

    return(
        <>
        
       
        <div className="auth-form">
          <form onSubmit={handlesubmit}>
            {error && <p className="error">{error.message}</p>}
            {message && <p className="error">{message}</p>}
            {sessionExpiredMessage && <p className="error">{sessionExpiredMessage}</p>}

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button className="btn btn-primary" type="submit" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </button>

            <div className="form-footer">
              <p>
                New here?{' '}
                <button type="button" className="btn btn-secondary" onClick={onSwitch}>
                  Create account
                </button>
              </p>
            </div>
          </form>
        </div>


        </>
    )
}