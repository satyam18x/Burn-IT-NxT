'use client';

import React, { useState, useEffect } from 'react';
import ProgramCard from '@/components/ProgramCard';
import { X, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Programs() {
  const [programsData, setProgramsData] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setProgramsData(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const getIncludes = (includesStr) => {
    if (!includesStr) return [];
    try {
      const parsed = JSON.parse(includesStr);
      if (Array.isArray(parsed)) return parsed;
      return includesStr.split(',').map(s => s.trim());
    } catch (e) {
      return includesStr.split(',').map(s => s.trim());
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', paddingBottom: '5rem' }}>
      <section className="section-padding dark-section" style={{ textAlign: 'center', minHeight: '30vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', marginBottom: '1rem', lineHeight: '1.2' }}>Choose Your Transformation Program</h1>
          <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'rgba(255,255,255,0.8)' }}>Select the program that fits your goals. Start instantly.</p>
        </div>
      </section>

      <section className="container" style={{ marginTop: '3rem' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {programsData.map(prog => (
            <div key={prog.id} style={{ height: '100%' }}>
              <ProgramCard 
                {...prog} 
                includes={getIncludes(prog.includes)}
                onViewDetails={() => setSelectedProgram(prog)} 
              />
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Program Details */}
      {selectedProgram && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1.5fr' }}>
            <button 
              onClick={() => setSelectedProgram(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', border: 'none', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={24} />
            </button>
            <div style={{ background: `url(${selectedProgram.image}) center/cover`, minHeight: '300px' }}></div>
            <div style={{ padding: '2rem' }}>
              <span style={{ display: 'inline-block', background: 'var(--color-accent)', color: 'var(--color-primary)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>{selectedProgram.duration}</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{selectedProgram.title}</h2>
              <p style={{ color: 'var(--color-text)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{selectedProgram.description}</p>
              
              <h4 style={{ marginBottom: '1rem' }}>What's Included:</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {getIncludes(selectedProgram.includes).map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <CheckSquare color="var(--color-primary)" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
