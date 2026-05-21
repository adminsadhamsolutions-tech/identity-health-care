import { useEffect, useState } from 'react';
import { get } from '../api';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    get('/gallery')
      .then((res) => setItems(res.data))
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="section" id="gallery">
      <div className="container text-center">
        <p style={{ color: '#6a1b9a', fontWeight: 700, marginBottom: '14px' }}>Visual wellness</p>
        <h2 className="section-title">Gallery & wellness moments</h2>
        <p className="section-subtitle">
          Explore our calming studio, rehabilitation sessions, group fitness energy, and movement therapy.
        </p>
        <div className="grid gallery-grid">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="gallery-item"
              onClick={() => setSelected(item)}
              style={{ border: 'none', padding: 0, cursor: 'pointer' }}
            >
              {item.type === 'video' ? (
                <video src={item.media_url} muted preload="metadata" />
              ) : (
                <img src={item.media_url} alt="Gallery media" />
              )}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="gallery-overlay" onClick={() => setSelected(null)}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            {selected.type === 'video' ? (
              <video controls src={selected.media_url} />
            ) : (
              <img src={selected.media_url} alt="Expanded gallery" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
