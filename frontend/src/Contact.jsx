import React from "react";
import "./Style.css";

export default function Contact() {
  return (
    <div className="landing-bg">
      <div className="container">

        <div className="info-card">
          <h1>Contact Us</h1>

          <p>
            Have questions or feedback about the Smart Home Energy Management System?
            Feel free to reach out to us.
          </p>

          <div className="contact-details">
            <p><strong>Email:</strong> support@smarthome.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Location:</strong> India</p>
          </div>

          <p>
            We are always happy to help you understand and use the system better.
          </p>

        </div>

      </div>
    </div>
  );
}
