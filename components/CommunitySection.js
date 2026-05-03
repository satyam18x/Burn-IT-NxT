'use client';

import React, { useRef } from 'react';
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react';

/**
 * Props:
 *   settings.webinar_link    — string | null
 *   settings.webinar_image   — string | null
 *   settings.webinar_title   — string | null
 *   settings.webinar_date    — string | null
 *   settings.whatsapp_link   — string | null
 */
export default function CommunitySection({ settings = {} }) {
  const sectionRef = useRef(null);

  const {
    webinar_link = null,
    webinar_image = null,
    webinar_title = 'Burn IT Out Masterclass',
    webinar_date = 'Date & Time coming soon',
    whatsapp_link = null,
  } = settings;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@900&family=DM+Sans:wght@400;500;700&display=swap');

        .cw-section {
          background: #ffffff;
          padding: 6rem 1.5rem;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .cw-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* ── MAIN LAYOUT GRID ── */
        .cw-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 4rem;
          align-items: center;
        }

        /* ── LEFT COLUMN ── */
        .cw-content-col {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .cw-header { text-align: left; }
        .cw-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(2.5rem, 6vw, 3.5rem);
          line-height: 1;
          color: #111;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
          letter-spacing: -0.01em;
        }
        .cw-title em {
          color: var(--color-primary, #e8000b);
          font-style: normal;
        }
        .cw-subtitle {
          color: #888;
          font-size: 1.1rem;
          font-weight: 500;
          max-width: 450px;
        }

        /* ── STACKED PANELS ── */
        .cw-stack {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .cw-panel {
          position: relative;
          height: 200px;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          transition: transform 0.3s;
          cursor: pointer;
          background: #111;
        }
        .cw-panel:hover { transform: translateY(-5px); }

        .cw-panel-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          transition: transform 0.6s;
        }
        .cw-panel-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%);
        }

        .cw-bg-text {
          position: absolute;
          top: -10%;
          right: 5%;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 4rem;
          font-weight: 900;
          color: rgba(255,255,255,0.06);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 2;
        }

        .cw-panel-content {
          position: relative;
          z-index: 3;
          color: #fff;
        }

        .cw-panel-tag {
          display: inline-flex;
          background: var(--color-primary, #e8000b);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .cw-panel-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.4rem;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .cw-panel-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          opacity: 0.8;
          margin-bottom: 1rem;
        }

        .cw-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          color: #111;
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.8rem;
          transition: background 0.3s;
        }
        .cw-panel:hover .cw-action-btn { background: var(--color-primary, #e8000b); color: #fff; }

        .cw-panel-wa { background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); }
        .cw-panel-wa .cw-panel-overlay { background: linear-gradient(to top, rgba(7, 94, 84, 0.9) 0%, transparent 100%); }

        /* ── RIGHT COLUMN: IMAGE ── */
        .cw-image-col {
          position: relative;
          height: 600px;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
        }
        .cw-image-col img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .cw-image-badge {
          position: absolute;
          bottom: 30px;
          right: 30px;
          background: #fff;
          padding: 1.5rem;
          border-radius: 20px;
          max-width: 200px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .cw-image-badge-text { font-size: 0.9rem; font-weight: 700; color: #111; line-height: 1.3; }

        @media (max-width: 950px) {
          .cw-main-grid { grid-template-columns: 1fr; gap: 3rem; }
          .cw-image-col { height: 450px; order: -1; }
          .cw-header { text-align: center; }
          .cw-subtitle { margin: 0 auto; }
        }
      `}</style>

      <section className="cw-section" ref={sectionRef}>
        <div className="cw-container">
          <div className="cw-main-grid">
            
            {/* LEFT: CONTENT & BOXES */}
            <div className="cw-content-col">
              <div className="cw-header">
                <h2 className="cw-title">Ready to <em>Transform?</em></h2>
                <p className="cw-subtitle">Your journey to a better you starts here. Choose your path below.</p>
              </div>

              <div className="cw-stack">
                {/* PANEL 1: WEBINAR */}
                <div className="cw-panel" onClick={() => webinar_link && window.open(webinar_link, '_blank')}>
                  <div className="cw-bg-text">WEBINAR</div>
                  <div className="cw-panel-bg">
                    {webinar_image ? (
                      <img src={webinar_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#222' }} />
                    )}
                  </div>
                  <div className="cw-panel-overlay" />
                  
                  <div className="cw-panel-content">
                    <div className="cw-panel-tag">Live Session</div>
                    <h3 className="cw-panel-title">{webinar_title}</h3>
                    <div className="cw-panel-meta">
                      <Calendar size={16} />
                      {webinar_date}
                    </div>
                    
                    {webinar_link ? (
                      <div className="cw-action-btn">
                        Register  <ArrowRight size={16} />
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Coming Soon</span>
                    )}
                  </div>
                </div>

                {/* PANEL 2: WHATSAPP */}
                <div className="cw-panel cw-panel-wa" onClick={() => whatsapp_link && window.open(whatsapp_link, '_blank')}>
                  <div className="cw-bg-text">JOIN</div>
                  <div className="cw-panel-overlay" />
                  
                  <div className="cw-panel-content">
                    <div className="cw-panel-tag" style={{ background: '#fff', color: '#25D366' }}>Group Chat</div>
                    <h3 className="cw-panel-title">WhatsApp Community</h3>
                    <div className="cw-panel-meta">
                      <MessageCircle size={16} />
                      Daily Motivation & Tips
                    </div>
                    
                    {whatsapp_link ? (
                      <div className="cw-action-btn">
                        Join Community <ArrowRight size={16} />
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Opening Soon</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: TUHINA DANCE IMAGE */}
            <div className="cw-image-col">
              <img src="/assets/tuhina-dance.jpg" alt="Tuhina Dance" />
              <div className="cw-image-badge">
                <p className="cw-image-badge-text">Find your rhythm and start your journey today.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
