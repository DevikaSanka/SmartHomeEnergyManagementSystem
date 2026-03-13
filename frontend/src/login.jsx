import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Style.css";
import { API_BASE_URL } from "./config";

function Login() {

  const navigate = useNavigate();
  const errorRef = useRef();
  const passRef = useRef();
  const [showPass, setShowPass] = useState(false);

  function togglePassword() {
    setShowPass(!showPass);
  }

  async function loginUser(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Login Successful!");
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        errorRef.current.innerText = errorData.message || "Invalid credentials.";
      }
    } catch (error) {
      console.error("Login Error:", error);
      errorRef.current.innerText = "Network error while logging in.";
    }
  }

  return (
    <div className="login-bg">
      <div className="outer-box">

        <h2>Smart Home Energy Management System Login</h2>

        <form onSubmit={loginUser}>

          <label>Email</label>
          <input type="email" id="login_email" name="email" required />

          <label>Password</label>
          <div className="password-box">
            <input type={showPass ? "text" : "password"} id="login_password" name="password" ref={passRef} required />
            <span className="eye" onClick={togglePassword}>👁</span>
          </div>

          <p ref={errorRef} className="error"></p>

          <button type="submit">Login</button>

          <div className="form-footer">
            <span>Forgot your password? </span>
            <Link to="/forgot-password">Reset Here</Link>
          </div>

          <div className="form-footer" style={{ marginTop: "10px" }}>
            <span>Don't have an account? </span>
            <Link to="/register">Register</Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;