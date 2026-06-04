const serviceItems = [
  {
    icon: '💪',
    label: 'Everyday Health & Fitness Program',
    text: 'A guided fitness program focused on improving strength, flexibility, stamina, posture, and overall physical wellbeing through safe and structured exercise sessions.',
  },
  {
    icon: '⚖️',
    label: 'Weight Management Program',
    text: 'A structured wellness program combining exercise, dietary modifications, and lifestyle guidance to support healthy and sustainable weight management.',
  },
  {
    icon: '🧠',
    label: 'Diastasis Recti Rehabilitation',
    text: 'A physiotherapy-based core rehabilitation program designed to improve abdominal separation, posture, core stability, and functional strength after pregnancy.',
  },
  {
    icon: '👶',
    label: 'Postnatal Recovery Program',
    text: 'A guided recovery program focused on restoring strength, mobility, posture, pelvic stability, and overall wellbeing after childbirth.',
  },
  {
    icon: '🌸',
    label: 'Women’s Wellness Program (40+)',
    text: 'A low-impact wellness and fitness program designed to support healthy ageing, mobility, strength, hormonal wellbeing, and long-term wellness for women above 40.',
  },
  {
    icon: '🧘',
    label: 'Stretch to De-Stress Program',
    text: 'A gentle stretching and mobility program focused on improving flexibility, relieving muscular tension, reducing stiffness, and promoting relaxation.',
  },
  {
    icon: '🩺',
    label: 'Pelvic Floor Rehabilitation',
    text: 'A specialized physiotherapy program focused on pelvic floor strength, bladder control, pelvic health, and rehabilitation for women with pelvic floor concerns.',
  },
  {
    icon: '🔥',
    label: 'Metabolic Health Program',
    text: 'A personalized lifestyle wellness program combining exercise, diet, and healthy habit modification to support metabolic health and preventive wellness.',
  },
  {
    icon: '🦴',
    label: 'Pain Relief & Posture Correction',
    text: 'A physiotherapy-based rehabilitation program focused on reducing pain, improving posture, correcting movement imbalances, and restoring mobility.',
  },
  {
    icon: '👵',
    label: 'Senior Citizen Wellness Program',
    text: 'A safe and low-impact fitness program designed to improve mobility, balance, flexibility, strength, and functional wellbeing for older adults and senior citizens.',
  },
];

export default function Services() {
  return (
    <section className="section section-soft" id="services">

      <div className="container text-center">

        <p style={{ color: '#6a1b9a', fontWeight: 700, marginBottom: '14px' }}>
          Our signature services
        </p>

        <h2 className="section-title">
          Holistic care for every stage of your journey
        </h2>

        <p className="section-subtitle">
          A curated suite of women-focused physiotherapy and fitness programs that combine medical expertise
          with warm, supportive coaching.
        </p>

        <div className="grid services-grid">

          {Array.isArray(serviceItems) && serviceItems.length > 0 ? (
            serviceItems.map((service) => (
              <article key={service.label} className="service-card">

                <div className="service-icon">
                  {service.icon}
                </div>

                <h3>{service.label}</h3>

                <p>{service.text}</p>

              </article>
            ))
          ) : (
            <p>No services available</p>
          )}

        </div>

      </div>

    </section>
  );
}