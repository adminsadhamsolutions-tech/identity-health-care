import { useState, useEffect } from 'react';
import { get, post, put, del } from '../../api';

function HeroManager() {

  const emptyForm = {

    id: null,

    badge_text: '',
    title: '',
    subtitle: '',
    background_image: '',
    button1_text: '',
    button2_text: ''

  };

  const [slides, setSlides] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [message, setMessage] = useState('');

  useEffect(() => {

    loadSlides();

  }, []);

  const loadSlides = async () => {

    try {

      const response = await get('/hero');

      setSlides(response.data);

    } catch(error) {

      console.log(error);

    }

  };

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  // ADD OR UPDATE

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (form.id) {
        await put('/hero', form, true);
      } else {
        await post('/hero', form, true);
      }

      setMessage(
        form.id
          ? 'Slide Updated Successfully'
          : 'Slide Added Successfully'
      );

      setForm(emptyForm);

      loadSlides();

    } catch(error) {

      console.log(error);

      setMessage('Something went wrong');

    }

  };

  // EDIT

  const handleEdit = (slide) => {

    setForm(slide);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  };

  // DELETE

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      'Delete this slide?'
    );

    if(!confirmDelete) return;

    try {

      await del(`/hero/${id}`, true);

      loadSlides();

    } catch(error) {

      console.log(error);

    }

  };

  return (

    <div className="admin-manager">

      <div className="manager-header">

        <div>

          <h2>Hero Slides Manager</h2>

          <p>
            Add, edit and delete hero sliders.
          </p>

        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="manager-item"
        style={{ marginBottom: '30px' }}
      >

        <label>Badge Text</label>

        <input
          type="text"
          name="badge_text"
          value={form.badge_text}
          onChange={handleChange}
        />

        <label>Hero Title</label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <label>Subtitle</label>

        <textarea
          rows="5"
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
        />

        <label>Background Image URL</label>

        <input
          type="text"
          name="background_image"
          value={form.background_image}
          onChange={handleChange}
        />

        <label>Button 1 Text</label>

        <input
          type="text"
          name="button1_text"
          value={form.button1_text}
          onChange={handleChange}
        />

        <label>Button 2 Text</label>

        <input
          type="text"
          name="button2_text"
          value={form.button2_text}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="cta-button"
          style={{ marginTop: '20px' }}
        >

          {form.id
            ? 'Update Slide'
            : 'Add Slide'}

        </button>

        {form.id && (

          <button
            type="button"
            className="button-secondary"
            style={{ marginLeft: '10px' }}
            onClick={() => setForm(emptyForm)}
          >
            Cancel Edit
          </button>

        )}

        {message && (

          <p style={{ marginTop: '15px' }}>
            {message}
          </p>

        )}

      </form>

      {/* LIST */}

      <div className="manager-list">

        {slides.map((slide) => (

          <div
            key={slide.id}
            className="manager-item"
          >

            <img
              src={slide.background_image}
              alt=""
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                borderRadius: '20px',
                marginBottom: '15px'
              }}
            />

            <h3>
              {slide.title}
            </h3>

            <p>
              {slide.subtitle}
            </p>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px'
              }}
            >

              <button
                className="button-secondary"
                onClick={() => handleEdit(slide)}
              >
                Edit
              </button>

              <button
                className="cta-button"
                onClick={() => handleDelete(slide.id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default HeroManager;