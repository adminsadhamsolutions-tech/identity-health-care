import { useEffect } from 'react';

export default function Testimonials() {

  useEffect(() => {

    // Prevent duplicate script loading
    const existing = document.querySelector(
      "script[src*='elfsight']"
    );
    if (existing) return;

    const script = document.createElement('script');

    script.src = "https://static.elfsight.com/platform/platform.js";
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

        {/* TOP TEXT */}
        <p
          style={{
            color: '#6a1b9a',
            fontWeight: '700',
            marginBottom: '14px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Google Reviews
        </p>

        <h2
          style={{
            fontSize: '52px',
            fontWeight: '800',
            color: '#111',
            marginBottom: '20px',
          }}
        >
          What Women Say About Us
        </h2>

        <p
          style={{
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto 60px',
            lineHeight: '1.9',
            fontSize: '18px',
          }}
        >
          Real stories and authentic experiences shared directly
          from Google reviews.
        </p>

        {/* ELFSIGHT WIDGET */}
        <div
          className="elfsight-app"
          data-elfsight-app-lazy
        ></div>

      </div>
    </section>
  );
}