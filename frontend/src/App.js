import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SmartHomeLanding from "./SmartHomeLanding";
import Login from "./login";
import Register from "./register";
import Dashboard from "./dashboard";
import Features from "./Features";
import About from "./About";
import Contact from "./Contact";
import OtpVerification from "./otpVerification";
import ForgotPassword from "./ForgotPassword";
import ForgotPasswordOtpVerification from "./ForgotPasswordOtpVerification";
import ResetPassword from "./ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SmartHomeLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/verify" element={<ForgotPasswordOtpVerification />} />
        <Route path="/forgot-password/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </Router>
  );
}

export default App;
