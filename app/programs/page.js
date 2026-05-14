'use client';

import React, { useState, useEffect } from 'react';
import ProgramCard from '@/components/ProgramCard';
import CommunitySection from '@/components/CommunitySection';
import { useRouter } from 'next/navigation';

export default function Programs() {
  const [programsData, setProgramsData] = useState([]);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({ webinar_link: '', whatsapp_link: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      setUser(currentUser);

      // Fetch settings for CommunitySection
      try {
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.success) {
            setSettings(settingsData.settings);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }

      // Fetch courses based on user role
      if (currentUser) {
        try {
          const coursesRes = await fetch('/api/user/courses');
          if (coursesRes.ok) {
            const coursesData = await coursesRes.json();
            setProgramsData(coursesData);
          }
        } catch (error) {
          console.error('Error fetching user courses:', error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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

  const showCommunity = !user || user.role === 'admin';
  const showCourses = !!user;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', paddingBottom: '5rem' }}>
      <section className="section-padding dark-section" style={{ textAlign: 'center', minHeight: '30vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', marginBottom: '1rem', lineHeight: '1.2' }}>
            {user ? 'Your Transformation Programs' : 'Choose Your Transformation Program'}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'rgba(255,255,255,0.8)' }}>
            {user ? 'Continue your journey where you left off.' : 'Select the program that fits your goals. Start instantly.'}
          </p>
        </div>
      </section>

      {showCommunity && (
        <div style={{ marginTop: '0' }}>
          <CommunitySection settings={settings} />
        </div>
      )}

      {showCourses && (
        <section className="container" style={{ marginTop: '3rem' }}>
          {programsData.length > 0 ? (
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
          ) : (
            !showCommunity && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h3>No enrolled programs found.</h3>
                <p>Join our community to get started on your transformation!</p>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
}
