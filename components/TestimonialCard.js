import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ quote, name, result, beforeImg, afterImg }) => {
  return (
    <div className="card testimonial-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <Quote size={32} color="var(--color-primary)" style={{ opacity: 0.5 }} />
      <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--color-text)', flexGrow: 1 }}>"{quote}"</p>
      
      {beforeImg && afterImg && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ position: 'relative', paddingTop: '100%' }}>
            <img src={beforeImg} alt="Before" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', fontSize: '0.7rem', borderRadius: '4px' }}>Before</div>
          </div>
          <div style={{ position: 'relative', paddingTop: '100%' }}>
            <img src={afterImg} alt="After" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', fontSize: '0.7rem', borderRadius: '4px' }}>After</div>
          </div>
        </div>
      )}
      
      <div>
        <h4 style={{ fontSize: '1.1rem', color: 'var(--color-dark)' }}>{name}</h4>
        {result && <div style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem', marginTop: '0.25rem' }}>{result}</div>}
      </div>
    </div>
  );
};

export default TestimonialCard;
