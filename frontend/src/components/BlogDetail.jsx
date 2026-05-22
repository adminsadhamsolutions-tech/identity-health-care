import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { get } from '../api';

export default function BlogDetail() {

  const { id } = useParams();   // MUST come from route
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!id) return;

    setLoading(true);

    get(`/blogs.php?id=${id}`)
      .then((res) => {
        const data = res?.data ?? res;
        const blog = Array.isArray(data) ? data[0] : data;
        setBlog(blog);
      })
      .catch(() => setError('Blog not found'))
      .finally(() => setLoading(false));

  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  if (!blog) return null;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '860px' }}>

        <h2>{blog.title}</h2>
        <p>{blog.description}</p>

        <img src={blog.media_url} alt={blog.title} style={{ width: '100%' }} />

        <div>
          {(blog.content || '').split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <Link to="/">Back</Link>

      </div>
    </section>
  );
}