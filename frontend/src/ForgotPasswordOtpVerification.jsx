import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import "./Style.css";
import { API_BASE_URL } from "./config";

function ForgotPasswordOtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const [enteredOtp, setEnteredOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { email } = location.state || {};

    if (!email) {
        return <Navigate to="/forgot-password" />;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/otp/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: enteredOtp }),
            });

            setLoading(false);
            if (response.ok) {
                // Validation successful, move them to reset password form passing email and otp
                navigate("/forgot-password/reset", { state: { email, otp: enteredOtp } });
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Incorrect or expired OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setLoading(false);
            setError("Network error. Please try again later.");
        }
    };

    return (
        <div className="register-bg">
            <div className="outer-box">
                <h2>Verify Reset OTP</h2>
                <p>We've sent a 6-digit Reset OTP to your email: {email}</p>

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

                    <button type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Verify Code"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordOtpVerification;
