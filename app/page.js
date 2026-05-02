import React from 'react';
import Link from 'next/link';
import { Flame, PlayCircle, Star, CheckCircle2, Heart, Apple } from 'lucide-react';
import ProgramCard from '@/components/ProgramCard';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        >
          <source src="/assets/fitness.mp4" type="video/mp4" />
        </video>
        <div className="container hero-content hero-main-flex">
          <div className="hero-logo-side">
            <img src="/assets/logopng.png" alt="Burn IT Out Logo" className="hero-logo-img" />
          </div>
          <div className="hero-text-side">
            <h1>Burn IT Out Fitness <br /><span style={{ color: 'var(--color-primary)' }}>Your Transformation Starts at Home</span></h1>
            <p>Personalized fitness programs designed for real women with real goals. No gym required.</p>
            <div className="hero-buttons">
              <Link href="/programs" className="btn btn-primary">Start Your Journey</Link>
              <Link href="/programs" className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                <PlayCircle size={20} /> View Programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="container">
          <div className="trust-bar-track">
            <div className="trust-item"><Star size={18} color="var(--color-primary)" fill="var(--color-primary)" /> 1000+ Women Transformed</div>
            <div className="trust-item"><Flame size={18} color="var(--color-primary)" /> 100% Home-Based</div>
            <div className="trust-item"><Heart size={18} color="var(--color-primary)" /> Beginner Friendly</div>
            <div className="trust-item"><Apple size={18} color="var(--color-primary)" /> Includes Nutrition Plans</div>
          </div>
        </div>
      </div>

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

      {/* Popular Programs */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-light)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>Start Your Transformation</h2>
            <p style={{ color: 'var(--color-text)', maxWidth: '600px', margin: '0 auto' }}>Join thousands of women who have changed their lives with these programs.</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <ProgramCard
              title="21-Day Fat Burn Challenge"
              duration="21 Days"
              description="Our most popular program. Kickstart your metabolism with quick, highly effective daily home workouts."
              includes={["Daily video workouts", "Custom diet plan PDF", "Progress tracker", "WhatsApp Community"]}
              recommended={true}
              image="https://cdn.muscleandstrength.com/sites/default/files/fit_woman_doing_dumbbell_workout.jpg"
            />
            <ProgramCard
              title="Postpartum Recovery"
              duration="8 Weeks"
              description="Safely heal your core and rebuild your strength step-by-step after childbirth."
              includes={["Diastasis Recti safe", "Pelvic floor focus", "Nutrition for nursing moms", "Trainer support"]}
              image="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80"
            />
            <ProgramCard
              title="Beginner Fitness Plan"
              duration="4 Weeks"
              description="Never worked out before? This is for you. Learn the basics with zero intimidation."
              includes={["Form tutorials", "Low impact routines", "Beginner meal guide", "Weekly check-ins"]}
              image="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
            />
          </div>

          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link href="/programs" className="btn btn-outline" style={{ border: '2px solid var(--color-dark)', color: 'var(--color-dark)' }}>View All Programs</Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-padding dark-section" style={{ textAlign: 'center', backgroundColor: 'var(--color-primary)' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', marginBottom: '1.5rem' }}>Join 1000+ women transforming their bodies at home</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem', color: 'white' }}>
            Spaces are limited! Take the first step towards a stronger, healthier, and more confident you.
          </p>
          <Link href="/programs" className="btn" style={{ backgroundColor: 'var(--color-dark)', color: 'white', fontSize: '1.2rem', padding: '1rem 2rem' }}>
            View Programs
          </Link>
        </div>
      </section>
    </div>
  );
}
