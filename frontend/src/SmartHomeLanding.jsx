import React from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";

export default function SmartHomeLanding() {
  const navigate = useNavigate();

  return (
    <div
      className="landing-bg"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        overflow: "hidden"
      }}
    >
      {/* Subtle background glow blobs */}
      <div className="glow-blob blob-1"></div>
      <div className="glow-blob blob-2"></div>

      <div className="container" style={{ position: "relative", zIndex: 2 }}>

        {/* Navbar */}
        <div className="navbar fade-in-down">
          <h1
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
            onClick={() => navigate("/")}
          >
            <span style={{ fontSize: "32px" }}>⚡</span> SmartEnergy
          </h1>

          <div className="nav-links">
            <span onClick={() => navigate("/features")}>Features</span>
            <span onClick={() => navigate("/about")}>About</span>
            <span onClick={() => navigate("/contact")}>Contact</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="glass-card hero-layout slide-up">

          {/* Left Content */}
          <div className="left">
            <div className="feature-badge">✨ Next-Gen Energy Saving</div>

            <h2>Control • Monitor • Optimize Energy</h2>
            <p>
              Manage appliances, track electricity usage and reduce electricity
              cost with your intelligent smart home dashboard system.
            </p>

            <div className="buttons">
              <button
                onClick={() => navigate("/register")}
                className="primary pulse-hover"
              >
                Get Started
              </button>
            </div>

            {/* Social Proof Section */}
            <div className="social-proof fade-in-up">
              <div className="stars">★★★★★</div>
              <span>Trusted by 5,000+ Smart Homes</span>
            </div>
          </div>

          {/* Right Image */}
          <div className="hero-image floating-img">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Cyber Smart Home Dashboard"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
