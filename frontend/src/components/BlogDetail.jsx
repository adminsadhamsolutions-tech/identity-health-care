import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { get } from '../api';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    get(`/blogs/${id}`)
      .then((res) => setBlog(res))
      .catch(() => setError('Blog not found.'));
  }, [id]);

  if (error) {
    return (
      <section className="section">
        <div className="container text-center">
          <h2 className="section-title">Article unavailable</h2>
          <p className="section-subtitle">
            Sorry, we could not locate the blog post you requested.
          </p>
          <Link to="/" className="cta-button">
            Back Home
          </Link>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="section">
        <div className="container text-center">
          <p>Loading article...</p>
        </div>
      </section>
    );
  }

  const safeContent = blog.content || "";

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '860px' }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ color: '#6a1b9a', fontWeight: 700 }}>Blog</p>
          <h2 className="section-title">{blog.title}</h2>
          <p className="section-subtitle">{blog.description}</p>
        </div>

        <img
          src={blog.media_url}
          alt={blog.title}
          style={{
            width: '100%',
            borderRadius: '24px',
            marginBottom: '28px'
          }}
        />

        <div style={{ lineHeight: '1.9', color: 'var(--muted)', fontSize: '1rem' }}>
          {safeContent.split('\n').map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '18px' }}>
              {paragraph}
            </p>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/" className="button-secondary">
            Back to Home
          </Link>
        </div>

      </div>
    </section>
  );
}