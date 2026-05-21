const serviceItems = [
  {
    icon: '🧘',
    label: 'Physiotherapy',
    text: 'Targeted care for recovery, pain relief, and mobility restoration with clinical precision.',
  },
  {
    icon: '⚖️',
    label: 'Weight Loss Program',
    text: 'Guided weight management plans tailored to women’s energy, metabolism, and lifestyle.',
  },
  {
    icon: '🤰',
    label: 'Antenatal Fitness',
    text: 'Safe prenatal movement and support to keep mothers strong during pregnancy.',
  },
  {
    icon: '👶',
    label: 'Postnatal Fitness',
    text: 'Recovery-focused training for postpartum wellness, strength, and balance.',
  },
  {
    icon: '🩺',
    label: 'Therapeutic Fitness',
    text: 'Medical exercise solutions that pair strength training with body restoration.',
  },
  {
    icon: '🔥',
    label: 'Metabolic Health',
    text: 'Science-backed coaching for better energy, hormone balance, and lasting results.',
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