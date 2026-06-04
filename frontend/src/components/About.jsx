import { useEffect, useState } from 'react';
import './About.css';
import { get } from '../api';

export default function About() {

  const [about, setAbout] = useState(null);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const response = await get('/about.php');

      const data = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      setAbout(data);

    } catch (error) {
      console.log(error);
    }
  };

  if (!about) {
    return (
      <div className="about-loading">
        Loading About Section...
      </div>
    );
  }

  return (
    <section id="about" className="about-section">

      <div className="about-container">

        {/* LEFT IMAGE */}
        <div className="about-image-area">

          <img
            src="/images/founder.png"
            alt={about.owner_name}
            className="about-image"
          />

          <div className="experience-badge">
            <h2>10+</h2>
            <p>Years</p>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">

          <p className="about-badge">
            {about.badge_text}
          </p>

          <h2 className="about-title">
            {about.title}
          </h2>

          <p className="about-subtitle">
            {about.subtitle}
          </p>

          {/* CARDS */}
          <div className="about-card">
            <h3>{about.card1_title}</h3>
            <p>{about.card1_desc}</p>
          </div>

          <div className="about-card">
            <h3>{about.card2_title}</h3>
            <p>{about.card2_desc}</p>
          </div>

          <div className="about-card">
            <h3>{about.card3_title}</h3>
            <p>{about.card3_desc}</p>
          </div>

          {/* ✅ FOUNDER SECTION */}
          <div className="founder-section">

            <h2 className="founder-title">
              {about.founder_title}
            </h2>

            <p className="founder-experience">
              {about.founder_experience}
            </p>

            <p className="founder-content">
              {about.founder_content}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}