import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { get } from '../api';

export default function BlogPreview() {

  const [blogs, setBlogs] = useState([]);

useEffect(() => {
 get('/api/blogs.php')
    .then((res) => setBlogs(res))
    .catch(() => setBlogs([]));
}, []);

  // WHATSAPP SHARE

  const shareWhatsApp = (blog) => {

    const websiteUrl =
      `https://www.identityphysiocare.in/blogs/${blog.id}`;

    const text = `

${blog.title}

${blog.description}

Read More:
${websiteUrl}

`;

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(
      whatsappUrl,
      '_blank'
    );

  };

  return (

    <section
      className="section section-soft"
      id="blog"
    >

      <div className="container text-center">

        <p
          style={{
            color: '#6a1b9a',
            fontWeight: 700,
            marginBottom: '14px'
          }}
        >
          Knowledge hub
        </p>

        <h2 className="section-title">
          Wellness blog for women
        </h2>

        <p className="section-subtitle">
          Practical articles, recovery tips,
          and mindful strategies to support
          every phase of your health journey.
        </p>

        <div className="grid blog-grid">

          {Array.isArray(blogs) && blogs.map((blog) => (

            <article
              key={blog.id}
              className="blog-card"
            >

              <img
                src={blog.media_url}
                alt={blog.title}
              />

              <h3>
                {blog.title}
              </h3>

              <p>
                {blog.description}
              </p>

              {/* BUTTONS */}

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  marginTop: '20px',
                  flexWrap: 'wrap'
                }}
              >

                <Link
                  to={`/blogs/${blog.id}`}
                  className="button-secondary"
                >
                  Read More
                </Link>

                {/* WHATSAPP */}

                <button
                  onClick={() => shareWhatsApp(blog)}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#25D366',
                    color: '#fff',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >

                  <FaWhatsapp />

                </button>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>

  );

}