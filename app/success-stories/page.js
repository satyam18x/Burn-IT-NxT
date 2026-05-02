import React from 'react';
import TestimonialCard from '@/components/TestimonialCard';
import { Play } from 'lucide-react';

export default function SuccessStories() {
  const testimonials = [
    {
      name: "Jessica M.",
      result: "Lost 8kg in 21 days",
      quote: "I never thought I could see such results from home. The 21-Day challenge completely changed my mindset and my body.",
      beforeImg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
      afterImg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Priya K.",
      result: "Lost 15kg in 3 Months",
      quote: "As a busy mother of two, the postpartum program was exactly what I needed. Short, effective, and safe workouts.",
      beforeImg: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
      afterImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Amanda R.",
      result: "Gained immense strength",
      quote: "The Beginner fitness plan helped me understand form. I was intimidated by gyms, but now I feel confident.",
      beforeImg: "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=400&q=80",
      afterImg: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div>
      <section className="section-padding dark-section text-center">
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 10vw, 3rem)', marginBottom: '1rem' }}>Real Women. Real Results.</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
            Don't just take our word for it. Look at the incredible transformations our community has achieved from home.
          </p>
        </div>
      </section>

      {/* Images Grid */}
      <section className="section-padding" style={{ backgroundColor: '#FFF0F5' }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {testimonials.map((t, idx) => (
              <TestimonialCard key={idx} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="section-padding">
        <div className="container">
          <h2 className="text-center" style={{ fontSize: 'clamp(1.8rem, 8vw, 2.5rem)', marginBottom: '3rem' }}>Hear It From Them</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="card" style={{ position: 'relative', paddingTop: '100%', cursor: 'pointer', overflow: 'hidden' }}>
                <img src={`https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80&sig=${idx}`} alt="Video Thumbnail" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={64} color="white" fill="white" style={{ opacity: 0.9 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding dark-section text-center">
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontStyle: 'italic', fontWeight: '400', maxWidth: '800px', margin: '0 auto', lineHeight: '1.5' }}>
            "Burn IT Out gave me my life back. I look forward to my 30 minutes every day. The community support is unmatched!"
          </h2>
          <p style={{ marginTop: '2rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--color-primary)' }}>- SARAH T.</p>
        </div>
      </section>
    </div>
  );
}
