import React from "react";
import "./HowToEnroll.css";

const HowToEnroll = () => {
  return (
    <section className="enroll-section">

      <div className="enroll-container">

        {/* LEFT CONTENT */}
        <div className="enroll-content">

          <p className="enroll-badge">Get Started</p>

          <h2 className="enroll-title">
            How to Enroll
          </h2>

          <p className="enroll-subtitle">
            Begin your journey towards better health with a personalized approach designed just for you.
          </p>

          <ul className="enroll-list">

            <li>
              Contact the center directly for program enquiry and appointment booking.
            </li>

            <li>
              Enrollment is provided only after detailed assessment and individual evaluation.
            </li>

            <li>
              Programs are customized based on your health condition, fitness level, goals, and suitability.
            </li>

            <li>
              Assessment includes discussion on health history, posture, mobility, lifestyle, and concerns.
            </li>

            <li>
              Based on evaluation, a structured plan with session frequency and guidance will be recommended.
            </li>

            <li>
              Prior appointment is preferred for assessment and enrollment.
            </li>

          </ul>

        </div>

        {/* RIGHT IMAGE */}
        <div className="enroll-image-area">

          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
            alt="Health consultation"
            className="enroll-image"
          />

        </div>

      </div>

    </section>
  );
};

export default HowToEnroll;