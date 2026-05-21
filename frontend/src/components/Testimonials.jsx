import { useEffect } from 'react';

export default function Testimonials() {

  useEffect(() => {

    const scriptId = "elfsight-platform-script";

    // prevent duplicate script load
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;

    document.body.appendChild(script);

  }, []);

  return (
    <section
      id="testimonials"
      style={{
        padding: '100px 20px',
        background: 'linear-gradient(to bottom right, #faf5ff, #ffffff)',
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >

        {/* HEADER */}
        <p style={{ color: '#6a1b9a', fontWeight: 700, marginBottom: 14 }}>
          Google Reviews
        </p>

        <h2 style={{ fontSize: 52, fontWeight: 800 }}>
          What Women Say About Us
        </h2>

        <p style={{ color: '#666', maxWidth: 800, margin: '0 auto 60px' }}>
          Real experiences from our clients.
        </p>

        {/* ELFSIGHT WIDGET (IMPORTANT PART) */}
        <div className="elfsight-app-29a7f1e8-6dee-48a8-a79b-d4b015384bce" />

      </div>
    </section>
  );
}