import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, put, del } from '../../api';
import HeroManager from './Heromanger';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'about', label: 'About Section' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'hero', label: 'Hero Section' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('identity-token'));
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState({ blogs: 0, gallery: 0, testimonials: 0, appointments: 0 });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    refreshCounts();
  }, [navigate, token]);

  const refreshCounts = async () => {
    try {
      const [blogs, gallery, testimonials, appointments] = await Promise.all([
        get('/blogs'),
        get('/gallery'),
        get('/testimonials'),
        get('/appointments', true),
      ]);
      setOverview({
        blogs: blogs.data.length,
        gallery: gallery.data.length,
        testimonials: testimonials.data.length,
        appointments: appointments.data.length,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('identity-token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <div className="admin-panel">
        <aside className="admin-sidebar">
          <h2>Admin Dashboard</h2>
          <p>Manage content, client feedback, and appointment requests.</p>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'active' : ''}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          <button style={{ marginTop: '24px' }} onClick={logout}>
            Log out
          </button>
        </aside>

<section className="admin-content">

  {activeTab === 'overview' && (
    <Overview overview={overview} />
  )}

  {activeTab === 'about' && (
    <AboutManager />
  )}

  {activeTab === 'blogs' && (
    <BlogManager token={token} onUpdate={refreshCounts} />
  )}

  {activeTab === 'gallery' && (
    <GalleryManager token={token} onUpdate={refreshCounts} />
  )}
{activeTab === 'hero' && (
  <HeroManager />
)}
  {activeTab === 'testimonials' && (
    <TestimonialManager token={token} onUpdate={refreshCounts} />
  )}

  {activeTab === 'appointments' && (
    <AppointmentList token={token} />
  )}

</section>

      </div>
    </div>
  );
}

function Overview({ overview }) {
  return (
    <div>
      <div className="manager-header">
        <div>
          <h2>Welcome back</h2>
          <p>Quick view of active content and appointment requests.</p>
        </div>
      </div>
      <div className="card-row">
        <div className="admin-card">
          <h3>Blogs</h3>
          <p>{overview.blogs} articles published</p>
        </div>
        <div className="admin-card">
          <h3>Gallery</h3>
          <p>{overview.gallery} media items available</p>
        </div>
        <div className="admin-card">
          <h3>Testimonials</h3>
          <p>{overview.testimonials} stories shared</p>
        </div>
        <div className="admin-card">
          <h3>Appointments</h3>
          <p>{overview.appointments} requests pending</p>
        </div>
      </div>
    </div>
  );
}

function BlogManager({ token, onUpdate }) {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', media_url: '', content: '' });
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    get('/blogs')
      .then((res) => setBlogs(res.data))
      .catch(() => setBlogs([]));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ title: '', description: '', media_url: '', content: '' });
    setEditId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!form.title || !form.description || !form.media_url || !form.content) {
      setStatus({ type: 'error', message: 'Fill in all blog details.' });
      return;
    }

    try {
      if (editId) {
        await put(`/blogs/${editId}`, form, true);
        setStatus({ type: 'success', message: 'Blog updated successfully.' });
      } else {
        await post('/blogs', form, true);
        setStatus({ type: 'success', message: 'Blog added successfully.' });
      }
      loadBlogs();
      resetForm();
      onUpdate?.();
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to save blog.' });
    }
  };

  const handleEdit = (blog) => {
    setEditId(blog.id);
    setForm({ title: blog.title, description: blog.description, media_url: blog.media_url, content: blog.content });
    setStatus(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await del(`/blogs/${id}`, true);
      loadBlogs();
      onUpdate?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <div>
          <h2>Blogs</h2>
          <p>Add, edit, and remove blog articles for the wellness content hub.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="manager-item" style={{ marginBottom: '24px' }}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />
        <label>Image / Video URL</label>
        <input name="media_url" value={form.media_url} onChange={handleChange} placeholder="https://..." />
        <label>Content</label>
        <textarea name="content" value={form.content} onChange={handleChange} rows="6" />
        <div style={{ marginTop: '18px' }}>
          <button type="submit" className="cta-button">
            {editId ? 'Update Blog' : 'Create Blog'}
          </button>
          {editId && (
            <button type="button" className="button-secondary" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
        {status && <div className={status.type === 'success' ? 'alert-success' : 'alert-error'}>{status.message}</div>}
      </form>
      <div className="manager-list">
        {blogs.map((blog) => (
          <div key={blog.id} className="manager-item">
            <h4>{blog.title}</h4>
            <p>{blog.description}</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="button-secondary" onClick={() => handleEdit(blog)}>
                Edit
              </button>
              <button className="cta-button" onClick={() => handleDelete(blog.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryManager({ token, onUpdate }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ media_url: '', type: 'image' });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = () => {
    get('/gallery')
      .then((res) => setItems(res.data))
      .catch(() => setItems([]));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    if (!form.media_url) {
      setStatus({ type: 'error', message: 'Provide the image or video URL.' });
      return;
    }

    try {
      await post('/gallery', form, true);
      setStatus({ type: 'success', message: 'Media uploaded.' });
      setForm({ media_url: '', type: 'image' });
      loadGallery();
      onUpdate?.();
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to upload media.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media item?')) return;
    await del(`/gallery/${id}`, true);
    loadGallery();
    onUpdate?.();
  };

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <div>
          <h2>Gallery</h2>
          <p>Upload on-brand photos and video links that showcase your studio and programs.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="manager-item" style={{ marginBottom: '24px' }}>
        <label>Media URL</label>
        <input name="media_url" value={form.media_url} onChange={handleChange} placeholder="https://..." />
        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <button type="submit" className="cta-button" style={{ marginTop: '16px' }}>
          Upload Media
        </button>
        {status && <div className={status.type === 'success' ? 'alert-success' : 'alert-error'}>{status.message}</div>}
      </form>
      <div className="manager-list">
        {items.map((item) => (
          <div key={item.id} className="manager-item">
            <h4>{item.type === 'video' ? 'Video' : 'Image'}</h4>
            <p>{item.media_url}</p>
            <button className="cta-button" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialManager({ token, onUpdate }) {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: '', message: '', rating: 5 });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = () => {
    get('/testimonials')
      .then((res) => setTestimonials(res.data))
      .catch(() => setTestimonials([]));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    if (!form.name || !form.message) {
      setStatus({ type: 'error', message: 'Please complete name and message.' });
      return;
    }
    try {
      await post('/testimonials', form, true);
      setStatus({ type: 'success', message: 'Testimonial added.' });
      setForm({ name: '', message: '', rating: 5 });
      loadTestimonials();
      onUpdate?.();
    } catch (error) {
      setStatus({ type: 'error', message: 'Unable to save testimonial.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    await del(`/testimonials/${id}`, true);
    loadTestimonials();
    onUpdate?.();
  };

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <div>
          <h2>Testimonials</h2>
          <p>Collect authentic feedback and help build trust for your healthcare brand.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="manager-item" style={{ marginBottom: '24px' }}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
        <label>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows="4" />
        <label>Rating</label>
        <select name="rating" value={form.rating} onChange={handleChange}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
        <button type="submit" className="cta-button" style={{ marginTop: '16px' }}>
          Add Testimonial
        </button>
        {status && <div className={status.type === 'success' ? 'alert-success' : 'alert-error'}>{status.message}</div>}
      </form>
      <div className="manager-list">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="manager-item">
            <h4>{testimonial.name}</h4>
            <p>{testimonial.message}</p>
            <p>Rating: {testimonial.rating}/5</p>
            <button className="cta-button" onClick={() => handleDelete(testimonial.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppointmentList({ token }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    get('/appointments', true)
      .then((res) => setAppointments(res.data))
      .catch(() => setAppointments([]));
  }, []);

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <div>
          <h2>Appointments</h2>
          <p>Review appointment requests submitted through the public site.</p>
        </div>
      </div>
      <div className="manager-list">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="manager-item">
            <h4>{appointment.name}</h4>
            <p>Phone: {appointment.phone}</p>
            <p>Email: {appointment.email}</p>
            <p>Service: {appointment.service}</p>
            <p>Date: {appointment.date} at {appointment.time}</p>
            <p>{appointment.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
function AboutManager() {

  const [form, setForm] = useState({

    owner_name: '',
    owner_photo: '',

    badge_text: '',
    title: '',
    subtitle: '',

    card1_title: '',
    card1_desc: '',

    card2_title: '',
    card2_desc: '',

    card3_title: '',
    card3_desc: '',

  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      const res = await get('/about');

      setForm(res.data);

    } catch (err) {
      console.log(err);
    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await put('/about', form, true);

      setMessage('About Section Updated');

    } catch (err) {

      setMessage('Update Failed');

    }

  };

  return (

    <div className="p-8">

      <div className="bg-white rounded-3xl shadow-xl p-10">

        <h2 className="text-4xl font-black mb-10">
          About Section
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* OWNER */}

          <div>

            <label className="block mb-2 font-semibold">
              Owner Name
            </label>

            <input
              type="text"
              name="owner_name"
              value={form.owner_name}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                rounded-2xl
                p-4
                outline-none
                focus:border-purple-600
              "
            />

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              Owner Photo URL
            </label>

            <input
              type="text"
              name="owner_photo"
              value={form.owner_photo}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                rounded-2xl
                p-4
                outline-none
                focus:border-purple-600
              "
            />

          </div>

          {/* BADGE */}

          <div>

            <label className="block mb-2 font-semibold">
              Badge Text
            </label>

            <input
              type="text"
              name="badge_text"
              value={form.badge_text}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                rounded-2xl
                p-4
              "
            />

          </div>

          {/* TITLE */}

          <div>

            <label className="block mb-2 font-semibold">
              Main Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                rounded-2xl
                p-4
              "
            />

          </div>

          {/* SUBTITLE */}

          <div>

            <label className="block mb-2 font-semibold">
              Subtitle
            </label>

            <textarea
              rows="5"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="
                w-full
                border
                border-gray-300
                rounded-2xl
                p-4
              "
            />

          </div>

          {/* CARD 1 */}

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 font-semibold">
                Card 1 Title
              </label>

              <input
                type="text"
                name="card1_title"
                value={form.card1_title}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  p-4
                "
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Card 1 Description
              </label>

              <textarea
                rows="4"
                name="card1_desc"
                value={form.card1_desc}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  p-4
                "
              />

            </div>

          </div>

          {/* CARD 2 */}

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 font-semibold">
                Card 2 Title
              </label>

              <input
                type="text"
                name="card2_title"
                value={form.card2_title}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  p-4
                "
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Card 2 Description
              </label>

              <textarea
                rows="4"
                name="card2_desc"
                value={form.card2_desc}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  p-4
                "
              />

            </div>

          </div>

          {/* CARD 3 */}

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 font-semibold">
                Card 3 Title
              </label>

              <input
                type="text"
                name="card3_title"
                value={form.card3_title}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  p-4
                "
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Card 3 Description
              </label>

              <textarea
                rows="4"
                name="card3_desc"
                value={form.card3_desc}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  p-4
                "
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="
              bg-purple-700
              hover:bg-purple-800
              text-white
              px-10
              py-4
              rounded-2xl
              font-bold
              transition
            "
          >
            Save About Section
          </button>

          {message && (

            <div className="text-green-600 font-bold">

              {message}

            </div>

          )}

        </form>

      </div>

    </div>

  );
}