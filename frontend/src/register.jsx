import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Style.css";
import { API_BASE_URL } from "./config";

function Register() {

  const navigate = useNavigate();
  const errorRef = useRef();
  const passRef = useRef();
  const confirmRef = useRef();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function togglePassword(field) {
    if (field === "password") setShowPass(!showPass);
    else setShowConfirm(!showConfirm);
  }

  async function registerUser(event) {
    event.preventDefault();

    let pass = passRef.current.value;
    let confirm = confirmRef.current.value;

    if (pass !== confirm) {
      errorRef.current.innerText = "Passwords do not match!";
      return;
    }

    errorRef.current.innerText = "";

    const email = event.target.email.value;
    const userData = {
      fullName: event.target.first_name.value,
      email: email,
      password: pass,
      address: event.target.address.value,
      gender: event.target.gender.value,
      primaryInterest: event.target.interest.value,
      phone: event.target.phone.value
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        // Navigate to OTP verification page and pass all user data via state
        navigate("/verify-otp", { state: { userData: userData } });
      } else {
        const errorData = await response.json();
        errorRef.current.innerText = errorData.message || "Failed to send OTP.";
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      errorRef.current.innerText = "Network error while sending OTP.";
    }
  }

  return (
    <div className="register-bg">
      <div className="outer-box">

        <h2>Smart Home Energy Management System Signup</h2>

        <form onSubmit={registerUser}>

          <label>Full Name</label>
          <input type="text" name="first_name" required minLength="4" placeholder="Enter Full Name" /><br /><br />

          <label>Email</label>
          <input type="email" name="email" required placeholder="example@email.com" /><br /><br />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPass ? "text" : "password"}
              id="password"
              name="password"
              ref={passRef}
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}"
              title="Password must contain at least 8 characters, including uppercase, lowercase, number and special symbol"
              placeholder="Enter Strong Password"
            />
            <span className="eye" onClick={() => togglePassword("password")}>👁</span>
          </div>

          <label>Confirm Password</label>
          <div className="password-box">
            <input
              type={showConfirm ? "text" : "password"}
              id="confirm_password"
              name="confirm_password"
              ref={confirmRef}
              required
              placeholder="Re-enter Password"
            />
            <span className="eye" onClick={() => togglePassword("confirm_password")}>👁</span>
          </div>

          <p ref={errorRef} className="error"></p>

          <label>Address</label>
          <input type="text" name="address" required minLength="10" placeholder="Address" /><br /><br />

          <label>Gender</label>
          <select name="gender" required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select><br /><br />

          <label>Primary Interest</label>
          <select id="interest" name="interest" required>
            <option value="">Select an option</option>
            <option value="energy_efficiency">Energy Efficiency</option>
            <option value="security">Security</option>
            <option value="comfort">Comfort</option>
            <option value="convenience">Convenience</option>
          </select><br /><br />

          <label>Phone Number</label>
          <input type="tel" name="phone" required pattern="[0-9]{10}" placeholder="Enter 10 digit phone number" /><br /><br />

          <button type="submit">Register</button>

          <div className="form-footer">
            <span>Already created an account? </span>
            <Link to="/login">Login</Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Register;