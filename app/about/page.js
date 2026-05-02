import React from 'react';

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '60vh', background: 'url(https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80) center/cover no-repeat', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,28,28,0.7)' }}></div>
        <div className="container hero-content text-center" style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>We're Built for <span style={{ color: 'var(--color-primary)' }}>Real Women</span></h1>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>
            Burn IT Out Fitness is a women-focused fitness platform designed to help you achieve sustainable fat loss, strength, and confidence from the comfort of your home. Whether you're a beginner, a new mom, or someone restarting your fitness journey — our programs are built to fit your lifestyle.
          </p>
        </div>
      </section>

      {/* MVV Cards */}
      <section className="section-padding">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--color-accent)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Our Mission</h3>
              <p>To provide accessible, effective, and sustainable fitness solutions for women everywhere, helping them build strength without sacrificing their lifestyle.</p>
            </div>
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--color-dark)', color: 'white' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Our Vision</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>To become the global leading home-fitness platform that redefines what it means to be a strong, confident woman in the modern era.</p>
            </div>
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--color-primary)', color: 'white' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Core Values</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)' }}>Empathy, Resilience, Integrity, and Consistency. We believe that small daily habits lead to massive life transformations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="section-padding">
        <div className="container">
          <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: 'clamp(1.5rem, 5vw, 3rem)', backgroundColor: 'var(--color-white)', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
              <img src="/assets/coach.jpg" alt="Founder - Tuhina Chakraborty" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px', boxShadow: 'var(--shadow-subtle)', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: '2 1 300px' }}>
              <h4 style={{ color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Meet Your Coach</h4>
              <h2 style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>Tuhina Chakraborty</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                With over a decade of experience in women's fitness and postpartum rehabilitation, Sarah founded Burn IT Out to bridge the gap between rigorous gym expectations and the reality of busy women.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                <li>🔥 Certified Personal Trainer (NASM)</li>
                <li>🧬 Nutrition Specialist</li>
                <li>👶 Postnatal Fitness Expert</li>
              </ul>
              <button className="btn btn-outline" style={{ color: 'var(--color-dark)', borderColor: 'var(--color-dark)' }}>Follow on Instagram</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
