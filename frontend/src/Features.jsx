import React from "react";
import "./Style.css";

export default function Features() {
  return (
    <div className="landing-bg">
      <div className="container">

        {/* Page Title */}
        <div className="features-header">
          <h1>System Features</h1>
          <p>
            Explore the powerful functionalities of our Smart Home Energy
            Management System.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="features-grid">

          <div className="feature-card">
            <h3>Real-Time Power Monitoring</h3>
            <p>Track total power usage instantly with live updates.</p>
          </div>

          <div className="feature-card">
            <h3>Device Control</h3>
            <p>Turn appliances ON/OFF remotely with smart toggles.</p>
          </div>

          <div className="feature-card">
            <h3>Room-wise Consumption</h3>
            <p>Monitor electricity usage room by room efficiently.</p>
          </div>

          <div className="feature-card">
            <h3>Cost Estimation</h3>
            <p>View real-time estimated electricity cost dynamically.</p>
          </div>

          <div className="feature-card">
            <h3>Energy Optimization</h3>
            <p>Reduce unnecessary consumption and improve efficiency.</p>
          </div>

          <div className="feature-card">
            <h3>Secure Authentication</h3>
            <p>Safe login & registration system for authorized access.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
