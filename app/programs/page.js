'use client';

import React, { useState, useEffect } from 'react';
import ProgramCard from '@/components/ProgramCard';
import { X, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Programs() {
  const [programsData, setProgramsData] = useState([]);
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
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {programsData.map(prog => (
            <div key={prog.id} style={{ height: '100%' }}>
              <ProgramCard 
                {...prog} 
                includes={getIncludes(prog.includes)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
