import React from 'react';
import Link from 'next/link';
import { Flame, PlayCircle, Star, CheckCircle2, Heart, Apple, Calendar, MessageCircle } from 'lucide-react';
import InstagramFeed from '@/components/InstagramFeed';
import Hero from '@/components/Hero';
import ScrollCards from '@/components/scrollcards';
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
     <Hero/>
     


      {/* What We Offer */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>What We Offer</h2>
            <p style={{ color: 'var(--color-text)', maxWidth: '600px', margin: '0 auto' }}>Programs tailored exclusively for women, focusing on sustainable results without stepping foot in a gym.</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Fat Loss Programs', icon: <Flame size={32} color="var(--color-primary)" />, desc: 'High-intensity, low-impact routines to torch calories safely.' },
              { title: 'Postpartum Fitness', icon: <Heart size={32} color="var(--color-primary)" />, desc: 'Gentle, core-healing exercises designed for new mothers.' },
              { title: 'Home Workout Plans', icon: <PlayCircle size={32} color="var(--color-primary)" />, desc: 'Follow-along videos needing minimal to zero equipment.' },
              { title: 'Nutrition Guidance', icon: <Apple size={32} color="var(--color-primary)" />, desc: 'Custom meal charts to complement your physical training.' }
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--color-accent)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
      <section className="section-padding" style={{ backgroundColor: 'var(--color-light)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>Join Our Community & Live Sessions</h2>
            <p style={{ color: 'var(--color-text)', maxWidth: '600px', margin: '0 auto' }}>Take the next step in your fitness journey by joining our exclusive WhatsApp community or registering for our upcoming live webinars.</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Webinar Card */}
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderTop: '4px solid var(--color-primary)' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--color-accent)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Calendar size={32} color="var(--color-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Upcoming Webinar</h3>
              <p style={{ color: 'var(--color-text)', marginBottom: '2rem', minHeight: '60px' }}>Join our next live masterclass to learn the secrets of sustainable fat loss from home.</p>
              {settings.webinar_link ? (
                <a href={settings.webinar_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', display: 'inline-block' }}>Register Now</a>
              ) : (
                <button className="btn btn-outline" disabled style={{ width: '100%', opacity: 0.6 }}>Coming Soon</button>
              )}
            </div>

            {/* WhatsApp Card */}
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderTop: '4px solid #25D366' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', background: '#e8f9ef', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <MessageCircle size={32} color="#25D366" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>WhatsApp Community</h3>
              <p style={{ color: 'var(--color-text)', marginBottom: '2rem', minHeight: '60px' }}>Connect with hundreds of other women, get daily tips, and stay motivated together.</p>
              {settings.whatsapp_link ? (
                <a href={settings.whatsapp_link} target="_blank" rel="noopener noreferrer" className="btn" style={{ width: '100%', display: 'inline-block', backgroundColor: '#25D366', color: 'white' }}>Join Group</a>
              ) : (
                <button className="btn btn-outline" disabled style={{ width: '100%', opacity: 0.6 }}>Coming Soon</button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
