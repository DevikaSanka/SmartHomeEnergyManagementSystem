import { useState, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import "./Style.css";
import { API_BASE_URL } from "./config";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const passRef = useRef();
    const confirmRef = useRef();
    const errorRef = useRef();

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const { email, otp } = location.state || {};

    if (!email || !otp) {
        return <Navigate to="/forgot-password" />;
    }

    function togglePassword(field) {
        if (field === "password") setShowPass(!showPass);
        else setShowConfirm(!showConfirm);
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const newPassword = passRef.current.value;
        const confirmPassword = confirmRef.current.value;

        if (newPassword !== confirmPassword) {
            errorRef.current.innerText = "Passwords do not match!";
            return;
        }

        setLoading(true);
        errorRef.current.innerText = "";

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/forgot-password/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            setLoading(false);
            if (response.ok) {
                alert("Password reset successfully! Please log in.");
                navigate("/login");
            } else {
                const errorData = await response.json();
                errorRef.current.innerText = errorData.message || "Failed to reset password.";
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setLoading(false);
            errorRef.current.innerText = "Network error. Please try again later.";
        }
    };

    return (
        <div className="register-bg">
            <div className="outer-box">
                <h2>Enter New Password</h2>
                <p>Your OTP has been verified. Please enter a new password for {email}.</p>

                <form onSubmit={handleResetPassword}>
                    <label>New Password</label>
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

                    <label>Confirm New Password</label>
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

                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
