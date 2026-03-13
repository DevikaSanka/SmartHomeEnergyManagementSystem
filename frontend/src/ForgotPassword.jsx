import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Style.css";
import { API_BASE_URL } from "./config";

function ForgotPassword() {
    const navigate = useNavigate();
    const errorRef = useRef();
    const [loading, setLoading] = useState(false);

    const requestResetOtp = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/forgot-password/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            setLoading(false);
            if (response.ok) {
                navigate("/forgot-password/verify", { state: { email } });
            } else {
                const errorData = await response.json();
                errorRef.current.innerText = errorData.message || "Failed to send reset OTP.";
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            setLoading(false);
            errorRef.current.innerText = "Network error. Please try again.";
        }
    };

    return (
        <div className="login-bg">
            <div className="outer-box">
                <h2>Reset Your Password</h2>
                <p style={{ textAlign: "center", marginBottom: "20px" }}>
                    Enter your registered email address to receive an OTP.
                </p>

                <form onSubmit={requestResetOtp}>
                    <label>Email</label>
                    <input type="email" name="email" required placeholder="example@email.com" />

                    <p ref={errorRef} className="error"></p>

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>

                    <div className="form-footer">
                        <span>Remembered your password? </span>
                        <Link to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
