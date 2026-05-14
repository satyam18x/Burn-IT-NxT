import React from 'react';
import Link from 'next/link';
import { Flame, PlayCircle, Star, CheckCircle2, Heart, Apple, Calendar, MessageCircle } from 'lucide-react';
import InstagramFeed from '@/components/InstagramFeed';
import Hero from '@/components/Hero';
import IntroVideo from '@/components/IntroVideo';
import ScrollCards from '@/components/scrollcards';
import CommunitySection from '@/components/CommunitySection';
import { db } from '@/lib/db';

export default async function Home() {
  let settings = { webinar_link: '', whatsapp_link: '' };
  try {
    const [rows] = await db.query('SELECT key_name, value FROM settings');
    rows.forEach(row => { settings[row.key_name] = row.value; });
  } catch (error) {
    console.error('Error fetching links for homepage:', error);
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero settings={settings}/>
      
      {/* Intro Video Section */}
      <IntroVideo />

      {/* Meet Your Coach */}
      <section className="section-padding dark-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)', marginBottom: '3rem' }}>Meet Your Coach</h2>
          <div className="grid-2-cols" style={{ alignItems: 'center', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src="/assets/transform.jpeg"
                alt="Transformation"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  borderRadius: 'var(--radius-card)',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              />
            </div>
            <div className="coach-content">
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Hi, I'm your Head Trainer!</h3>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
                I know exactly what it feels like to struggle with consistency and fad diets. My mission is to show you that a sustainable, healthy lifestyle is completely achievable from your living room.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  "Certified Fitness & Nutrition Expert",
                  "Specialized in Women's Home Workouts",
                  "Postpartum Core & Recovery Specialist"
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <CheckCircle2 size={24} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)' }}>{text}</p>
                  </div>
                ))}
              </div>
              <div>
                <Link href="/about" className="btn btn-primary" style={{ width: '100%', maxWidth: 'max-content' }}>Read My Full Story</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--color-light)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>Follow Along on Instagram</h2>
            <p style={{ color: 'var(--color-text)', maxWidth: '600px', margin: '0 auto' }}>
              Daily motivation, workout tips, and real transformations — follow the journey.
            </p>
          </div>

          <InstagramFeed />

          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <a
              href="https://www.instagram.com/burnitoutfitness"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ border: '2px solid var(--color-dark)', color: 'var(--color-dark)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      <ScrollCards/>

      {/* Dynamic Community & Webinar Section */}
      <CommunitySection settings={settings} />
    </div>
  );
}
