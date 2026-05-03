'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function IntroVideo() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Audio ON by default
  const [isPlaying, setIsPlaying] = useState(true); // Playing by default

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          if (isPlaying) {
            videoRef.current?.play().catch(err => {
              console.log("Autoplay blocked (likely due to sound):", err);
            });
          }
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isPlaying]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log("Play blocked:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const buttonStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
    zIndex: 10,
    outline: 'none'
  };

  return (
    <section 
      ref={containerRef}
      className="intro-video-section"
      style={{
        padding: '6rem 0',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 8vw, 3.5rem)', 
            color: '#111',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            Welcome to the <span style={{ color: 'var(--color-primary)' }}>Burn IT Out</span> Community
          </h2>
          <p style={{ 
            color: '#555', 
            maxWidth: '700px', 
            margin: '0 auto',
            fontSize: '1.1rem'
          }}>
            Take a look at how we help women achieve their fitness goals through sustainable habits and expert guidance.
          </p>
        </div>

        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)',
          background: '#f8f8f8',
          aspectRatio: '16/9'
        }}>
          {/* Main Video */}
          <video
            ref={videoRef}
            muted={isMuted}
            loop
            playsInline
            poster="/assets/intro.png"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          >
            <source src="/assets/park_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Left Controls - Play/Pause */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            display: 'flex',
            gap: '12px',
            zIndex: 10
          }}>
            <button
              onClick={togglePlay}
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'}
            >
              {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{ marginLeft: '3px' }} />}
            </button>
          </div>

          {/* Right Controls - Volume */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 10
          }}>
            <button
              onClick={toggleMute}
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative background elements - subtler for light theme */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, var(--color-primary-faded) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0,
        opacity: 0.15
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, #ff5a0044 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0,
        opacity: 0.15
      }} />
    </section>
  );
}
