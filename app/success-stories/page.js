'use client';
import React, { useState } from 'react';
import TestimonialCard from '../../components/TestimonialCard';
import { Play, MessageCircle, Quote, X } from 'lucide-react';

export default function SuccessStories() {
  const [activeVideo, setActiveVideo] = useState(null);

  // Video Testimonials
  const videoStories = [
    {
      title: "Transformation Journey #1",
      videoUrl: "/assets/video1.mp4",
    },
    {
      title: "Transformation Journey #2",
      videoUrl: "/assets/video2.mp4",
    },
    {
      title: "Transformation Journey #3",
      videoUrl: "/assets/video3.mp4",
    }
  ];

  const transformations = [
    {
      name: "Jessica M.",
      result: "Lost 8kg in 21 days",
      quote: "I never thought I could see such results from home. The 21-Day challenge completely changed my mindset and my body.",
      beforeImg: "/assets/before1.jpg",
      afterImg: "/assets/after1.jpg"
    },
    {
      name: "Priya K.",
      result: "Lost 15kg in 3 Months",
      quote: "As a busy mother of two, the postpartum program was exactly what I needed. Short, effective, and safe workouts.",
      beforeImg: "/assets/before2.jpg",
      afterImg: "/assets/after2.jpg"
    },
    {
      name: "Amanda R.",
      result: "Gained immense strength",
      quote: "The Beginner fitness plan helped me understand form. I was intimidated by gyms, but now I feel confident.",
      beforeImg: "/assets/before3.jpg",
      afterImg: "/assets/after3.jpg"
    }
  ];

  // WhatsApp Appreciation Chats
  const chatImages = [
    "/assets/w1.jpg",
    "/assets/w2.jpg",
    "/assets/w3.jpg",
    "/assets/w4.jpg",
    "/assets/w5.jpg",
    "/assets/w6.jpg",
  ];

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {/* HERO SECTION */}
      <section className="section-padding dark-section text-center" style={{ padding: '6rem 1rem', background: '#111' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', marginBottom: '1rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: '900', textTransform: 'uppercase' }}>
            Real Women. <span style={{ color: 'var(--color-primary)' }}>Real Results.</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
            Our community is living proof that transformation is possible with the right mindset and support.
          </p>
        </div>
      </section>

      {/* 1. VIDEOS (TOP) */}
      <section className="section-padding" style={{ padding: '5rem 0', background: '#fcfcfc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Hear It From <span style={{ color: 'var(--color-primary)' }}>Them</span>
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Real video testimonials from our amazing members.</p>
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '4rem' }}>
            {videoStories.map((story, idx) => (
              <div 
                key={idx} 
                className="video-card-container" 
                onClick={() => setActiveVideo(story)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ 
                  position: 'relative', 
                  paddingTop: '120%', 
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  backgroundColor: '#222'
                }}>
                  {/* Video Preview (Acting as Thumbnail) */}
                  <video 
                    src={story.videoUrl}
                    preload="metadata"
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      opacity: 0.7
                    }}
                  />
                  
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.2)', 
                      backdropFilter: 'blur(10px)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '2px solid rgba(255,255,255,0.5)',
                      transition: 'transform 0.3s'
                    }}>
                      <Play size={32} color="white" fill="white" />
                    </div>
                  </div>

                  <div style={{ position: 'absolute', bottom: '25px', left: '25px', color: 'white' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>{story.title}</h4>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Watch Transformation</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHATSAPP APPRECIATION (BOTTOM) */}
      <section className="section-padding" style={{ 
        padding: '8rem 0', 
        position: 'relative', 
        overflow: 'hidden', 
        background: 'linear-gradient(135deg, #f8faf9 0%, #e8f5ed 100%)' 
      }}>
        {/* Abstract Background Strips */}
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: '120%', height: '100px', background: 'rgba(37, 211, 102, 0.1)', transform: 'rotate(-5deg)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: '120%', height: '150px', background: 'rgba(37, 211, 102, 0.08)', transform: 'rotate(3deg)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '40%', height: '300px', background: 'rgba(37, 211, 102, 0.06)', transform: 'skewX(-20deg)', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1rem' }}>
              WhatsApp <span style={{ color: '#25D366' }}>Appreciation</span>
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Love and feedback from our incredible community chat. This is why we do what we do!</p>
          </div>

          <div className="grid" style={{ 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            columnGap: '5rem',
            rowGap: '2.5rem',
            maxWidth: '900px',
            margin: '0 auto' 
          }}>
            {chatImages.map((img, idx) => (
              <div key={idx} style={{ 
                borderRadius: '16px', 
                overflow: 'hidden', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                border: '1px solid #eee'
              }}>
                <img src={img} alt={`WhatsApp Appreciation ${idx + 1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <button 
            onClick={() => setActiveVideo(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              padding: '10px',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            <X size={24} />
          </button>
          
          <div style={{ width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'black' }}>
            <video 
              src={activeVideo.videoUrl} 
              controls 
              autoPlay 
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* FINAL QUOTE */}
      <section className="section-padding dark-section text-center" style={{ padding: '6rem 1rem', background: '#111' }}>
        <div className="container">
          <Quote size={48} color="var(--color-primary)" style={{ marginBottom: '2rem', opacity: 0.5 }} />
          <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', fontStyle: 'italic', fontWeight: '400', maxWidth: '850px', margin: '0 auto', lineHeight: '1.6', color: '#fff' }}>
            "Burn IT Out gave me my life back. I look forward to my 30 minutes every day. The community support is unmatched!"
          </h2>
          <p style={{ marginTop: '2.5rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--color-primary)', textTransform: 'uppercase' }}>- SARAH T.</p>
        </div>
      </section>
    </div>
  );
}