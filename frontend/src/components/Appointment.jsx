import { useState } from 'react';
import { post } from '../api';

const services = [
  'Physiotherapy',
  'Weight Loss Program',
  'Antenatal Fitness',
  'Postnatal Fitness',
  'Therapeutic Fitness',
  'Metabolic Health',
];

export default function Appointment() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: services[0],
    message: '',
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    return form.name && form.phone && form.email && form.date && form.time && form.service;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!validate()) {
      setStatus({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    try {
      setLoading(true);

      // ✅ FIXED ENDPOINT
      await post('/appointments.php', form);

      setStatus({
        type: 'success',
        message: 'Appointment request submitted successfully!',
      });

      setForm({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        service: services[0],
        message: '',
      });

    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Unable to submit appointment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="appointment">
      <div className="container text-center">

        <p style={{ color: '#6a1b9a', fontWeight: 700, marginBottom: '14px' }}>
          Book your consultation
        </p>

        <h2 className="section-title">Schedule an appointment</h2>

        <p className="section-subtitle">
          Share your goals, choose a service, and we will reach out with available slots and next steps.
        </p>

        <form
          className="form-grid"
          onSubmit={handleSubmit}
          style={{ maxWidth: '920px', margin: '0 auto' }}
        >

          <div className="form-block">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-block">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-block">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-block">
              <label>Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} />
            </div>

            <div className="form-block">
              <label>Time</label>
              <input name="time" type="time" value={form.time} onChange={handleChange} />
            </div>
          </div>

          <div className="form-block">
            <label>Service</label>
            <select name="service" value={form.service} onChange={handleChange}>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div className="form-block">
            <label>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} />
          </div>

          <button className="cta-button" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Appointment Request'}
          </button>

          {status && (
            <div className={status.type === 'success' ? 'alert-success' : 'alert-error'}>
              {status.message}
            </div>
          )}

        </form>
      </div>
    </section>
  );
}