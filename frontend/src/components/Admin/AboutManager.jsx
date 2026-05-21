import { useEffect, useState } from 'react';
import { get, put } from '../../api';

export default function AboutManager() {

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

      setMessage('Updated Successfully');

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

          <input
            type="text"
            name="owner_name"
            value={form.owner_name}
            onChange={handleChange}
            placeholder="Owner Name"
            className="w-full border rounded-2xl p-4"
          />

          <input
            type="text"
            name="owner_photo"
            value={form.owner_photo}
            onChange={handleChange}
            placeholder="Owner Photo URL"
            className="w-full border rounded-2xl p-4"
          />

          <input
            type="text"
            name="badge_text"
            value={form.badge_text}
            onChange={handleChange}
            placeholder="Badge Text"
            className="w-full border rounded-2xl p-4"
          />

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border rounded-2xl p-4"
          />

          <textarea
            rows="5"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            className="w-full border rounded-2xl p-4"
          />

          <div className="grid md:grid-cols-2 gap-6">

            <div className="space-y-4">

              <input
                type="text"
                name="card1_title"
                value={form.card1_title}
                onChange={handleChange}
                placeholder="Card 1 Title"
                className="w-full border rounded-2xl p-4"
              />

              <textarea
                rows="4"
                name="card1_desc"
                value={form.card1_desc}
                onChange={handleChange}
                placeholder="Card 1 Description"
                className="w-full border rounded-2xl p-4"
              />

            </div>

            <div className="space-y-4">

              <input
                type="text"
                name="card2_title"
                value={form.card2_title}
                onChange={handleChange}
                placeholder="Card 2 Title"
                className="w-full border rounded-2xl p-4"
              />

              <textarea
                rows="4"
                name="card2_desc"
                value={form.card2_desc}
                onChange={handleChange}
                placeholder="Card 2 Description"
                className="w-full border rounded-2xl p-4"
              />

            </div>

          </div>

          <div>

            <input
              type="text"
              name="card3_title"
              value={form.card3_title}
              onChange={handleChange}
              placeholder="Card 3 Title"
              className="w-full border rounded-2xl p-4 mb-4"
            />

            <textarea
              rows="4"
              name="card3_desc"
              value={form.card3_desc}
              onChange={handleChange}
              placeholder="Card 3 Description"
              className="w-full border rounded-2xl p-4"
            />

          </div>

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
            Save Changes
          </button>

          {message && (
            <p className="font-semibold text-green-600">
              {message}
            </p>
          )}

        </form>

      </div>

    </div>

  );
}