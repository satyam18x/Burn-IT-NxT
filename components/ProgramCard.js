import React from 'react';
import { Camera, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const ProgramCard = ({ title, duration, image, description, includes, recommended, onViewDetails }) => {
  return (
    <div 
      className="card program-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        position: 'relative', 
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        maxWidth: '320px',
        margin: '0 auto'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0,0,0,0.1)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      {recommended && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--color-primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 'bold', zIndex: 10 }}>
          Popular
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', paddingTop: '55%', backgroundColor: 'var(--color-accent)', overflow: 'hidden' }}>
        <img 
          src={image || "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800"} 
          alt={title} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', zIndex: 1 }}></div>
      </div>
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1, zIndex: 2, background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
          <Clock size={14} /> {duration}
        </div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{title}</h3>
        <p style={{ color: 'var(--color-text)', fontSize: '0.85rem', marginBottom: '1rem', flexGrow: 1, opacity: 0.8 }}>{description}</p>
        
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {Array.isArray(includes) && includes.slice(0, 3).map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text)' }}>
                <CheckCircle2 size={14} color="var(--color-primary)" /> {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto' }}>
          <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>View Course</Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
