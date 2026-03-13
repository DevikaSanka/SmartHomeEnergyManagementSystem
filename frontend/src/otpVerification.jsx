import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import "./Style.css"; // Reuse existing styles if possible, or add new ones
import { API_BASE_URL } from "./config";

function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [enteredOtp, setEnteredOtp] = useState("");
  const [error, setError] = useState("");

  // Get the user data passed from the registration page
  const { userData } = location.state || {};

  // If accessed directly without userData, redirect back to register
  if (!userData || !userData.email) {
    return <Navigate to="/register" />;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      // Create request payload with user data and the entered OTP
      const payload = { ...userData, otp: enteredOtp };

      const response = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Registered Successfully!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Incorrect OTP or user already exists.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div className="register-bg">
      <div className="outer-box">
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit OTP to your email: {userData?.email || 'your email'}</p>

        <form onSubmit={handleVerify}>
          <label>Enter OTP</label>
          <input
            type="text"
            name="otp"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            required
            maxLength="6"
            pattern="[0-9]{6}"
            title="OTP must be 6 digits"
            placeholder="e.g. 123456"
          />
          <br /><br />

          <p className="error">{error}</p>

          <button type="submit">Verify & Register</button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;
