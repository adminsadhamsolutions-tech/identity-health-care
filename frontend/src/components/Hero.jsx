import { useEffect, useState } from 'react';
import './Hero.css';
import { get } from '../api';

export default function Hero() {

  const [slides, setSlides] = useState([]);

  const [current, setCurrent] = useState(0);

  useEffect(() => {

    loadSlides();

  }, []);

  const loadSlides = async () => {

    try {

      const response = await get('/hero.php');

      setSlides(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  // AUTO SLIDE

  useEffect(() => {

    if(slides.length === 0) return;

    const interval = setInterval(() => {

      nextSlide();

    }, 5000);

    return () => clearInterval(interval);

  }, [slides, current]);

  const nextSlide = () => {

    setCurrent((prev) =>

      prev === slides.length - 1
      ? 0
      : prev + 1

    );

  };

  const prevSlide = () => {

    setCurrent((prev) =>

      prev === 0
      ? slides.length - 1
      : prev - 1

    );

  };

  if(slides.length === 0) {

    return <div>Loading...</div>;

  }

  const slide = slides[current];

  return (

    <section
      className="hero-section"
      style={{
        backgroundImage: `url(${slide.background_image})`
      }}
    >

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <p className="hero-badge">
          {slide.badge_text}
        </p>

        <h1 className="hero-title">
          {slide.title}
        </h1>

        <p className="hero-subtitle">
          {slide.subtitle}
        </p>

        <div className="hero-buttons">

          <button className="hero-btn-primary">
            {slide.button1_text}
          </button>

          <button className="hero-btn-secondary">
            {slide.button2_text}
          </button>

        </div>

      </div>

      {/* LEFT BUTTON */}

      <button
        className="hero-nav left"
        onClick={prevSlide}
      >
        ❮
      </button>

      {/* RIGHT BUTTON */}

      <button
        className="hero-nav right"
        onClick={nextSlide}
      >
        ❯
      </button>

    </section>

  );

}