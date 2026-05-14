'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Users, ExternalLink, Calendar, Play, X, ArrowRight, Video, Radio } from 'lucide-react';

export default function HeroSection({ settings }) {
  const heroRef     = useRef(null);
  const imgWrapRef  = useRef(null);
  const imgRef      = useRef(null);
  const bgtextRef   = useRef(null);
  const curRef      = useRef(null);

  const tickerWords = [
    'Cardio', 'Strength', 'Nutrition', 'Mindfulness',
    'Postpartum Recovery', 'Dance Fitness', 'Yoga', 'Zumba',
    'Cardio', 'Strength', 'Nutrition', 'Mindfulness',
    'Postpartum Recovery', 'Dance Fitness', 'Yoga', 'Zumba',
  ];

  /* ── INTERACTIONS ── */
  useEffect(() => {
    const hero    = heroRef.current;
    const imgWrap = imgWrapRef.current;
    const img     = imgRef.current;
    const bgtext  = bgtextRef.current;
    const cur     = curRef.current;
    if (!hero) return;

    /* Custom cursor */
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      if (cur) { cur.style.left = `${mx}px`; cur.style.top = `${my}px`; }

      /* Parallax */
      const px = (e.clientX - r.left) / r.width  - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;
      if (bgtext)  bgtext.style.transform  = `translateX(${px * -20}px)`;
      if (imgWrap) imgWrap.style.transform = `translateX(calc(-42% + ${px * 14}px))`;
      if (img)     img.style.transform     = `perspective(900px) rotateX(${py * 6}deg) rotateY(${px * -8}deg)`;
    };

    const onLeave = () => {
      if (bgtext)  bgtext.style.transform  = 'translateX(0)';
      if (imgWrap) imgWrap.style.transform = 'translateX(-42%)';
      if (img)     img.style.transform     = 'perspective(900px) rotateX(0) rotateY(0)';
      if (cur)     cur.style.opacity = '0';
    };

    const onEnter = () => { if (cur) cur.style.opacity = '1'; };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    hero.addEventListener('mouseenter', onEnter);

    /* Cursor big on interactive els */
    hero.querySelectorAll('.h-popup-btn, .h-webinar-close, .h-whatsapp-close').forEach((el) => {
      el.addEventListener('mouseenter', () => cur && cur.classList.add('big'));
      el.addEventListener('mouseleave', () => cur && cur.classList.remove('big'));
    });

    /* Animated counters */
    const animateCounter = (el) => {
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';
      const isDecimal = el.dataset.decimal === 'true';
      if (isDecimal) {
        let v = 0; const target = 4.9; const step = target / 60;
        const t = setInterval(() => {
          v = Math.min(v + step, target);
          el.textContent = v.toFixed(1) + '★';
          if (v >= target) clearInterval(t);
        }, 16);
      } else {
        const suffix = el.dataset.suffix || '';
        const target = parseInt(el.dataset.target || '0', 10);
        const isK    = suffix.includes('K');
        let v = 0; const frames = 72;
        const step = target / frames;
        const t = setInterval(() => {
          v = Math.min(v + step, target);
          el.textContent = isK
            ? Math.round(v / 1000) + 'K+'
            : Math.round(v) + suffix;
          if (v >= target) clearInterval(t);
        }, 16);
      }
    };

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        hero.querySelectorAll('.h-stat-num[data-target]').forEach(animateCounter);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(hero);

    /* Click ripple on image */
    const onImgClick = (e) => {
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        width:0;height:0;border-radius:50%;
        border:2px solid #ff6a00;
        transform:translate(-50%,-50%);
        pointer-events:none;z-index:9998;
        animation:rippleOut .65s ease-out forwards`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    };
    if (img) img.addEventListener('click', onImgClick);

    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
      hero.removeEventListener('mouseenter', onEnter);
      if (img) img.removeEventListener('click', onImgClick);
      obs.disconnect();
    };
  }, []);

  const [showWebinarPopup, setShowWebinarPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWebinarPopup(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,900&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes h-rippleOut { to { width: 130px; height: 130px; opacity: 0; } }
        @keyframes h-fu        { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes h-fi        { from { opacity: 0; } to { opacity: 1; } }
        @keyframes h-slideUp   { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes h-tick      { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes h-pulse-glow { 0%,100% { opacity:.6; transform:translateX(-50%) scale(1);} 50% { opacity:1; transform:translateX(-50%) scale(1.1);} }
        @keyframes h-blink     { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes h-broadcast { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }

        .h-hero {
          position: relative;
          width: 100%;
          height: 88vh;
          min-height: 580px;
          max-height: 880px;
          background: #0a0a0a;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          cursor: none;
        }

        /* Noise overlay */
        .h-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          z-index: 1; pointer-events: none;
        }
        /* Scanlines */
        .h-hero::after {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.012) 2px, rgba(255,255,255,.012) 4px);
          z-index: 1; pointer-events: none;
        }

        /* Custom cursor */
        .h-cursor {
          position: absolute;
          width: 12px; height: 12px;
          background: #ff6a00;
          border-radius: 50%;
          pointer-events: none;
          z-index: 999;
          transform: translate(-50%, -50%);
          transition: width .2s, height .2s, opacity .2s;
          mix-blend-mode: screen;
          opacity: 0;
        }
        .h-cursor.big { width: 44px; height: 44px; opacity: .3; }

        /* Content */
        .h-content {
          position: relative; z-index: 2;
          flex: 1; display: flex; flex-direction: column; min-height: 0;
        }

        /* Top row */
        .h-top-row {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: start;
          padding: 2rem 2.5rem 0;
          position: relative; z-index: 6;
          gap: 1rem;
        }

        /* Quote */
        .h-quote { animation: h-fu .7s .15s ease both; }
        .h-quote-mark {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900; font-size: 3.5rem;
          color: #ff6a00; line-height: .7;
          display: block; margin-bottom: .35rem;
        }
        .h-quote-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 1.55rem;
          line-height: 1.28; color: #fff;
          text-transform: uppercase; letter-spacing: .03em;
        }
        .h-quote-author {
          font-size: .72rem; color: #555;
          margin-top: .55rem; font-weight: 500;
          letter-spacing: .05em; text-transform: uppercase;
        }

        /* Stats */
        .h-stats {
          display: flex; flex-direction: column;
          gap: .75rem; align-items: flex-end;
          animation: h-fu .7s .3s ease both;
        }
        .h-stat { text-align: right; }
        .h-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900; font-size: 2.4rem; line-height: 1;
          color: transparent;
          background-image: repeating-linear-gradient(-55deg, #555 0, #555 1.5px, transparent 1.5px, transparent 9px);
          -webkit-background-clip: text; background-clip: text;
          letter-spacing: -.02em;
          transition: color .25s, background-image .25s;
        }
        .h-stat:hover .h-stat-num {
          background-image: none;
          color: #ff6a00;
        }
        .h-stat-label {
          font-size: .62rem; color: #444;
          text-transform: uppercase; letter-spacing: .12em; font-weight: 600;
        }

        /* BG text */
        .h-bg-name {
          position: absolute;
          left: 0; right: 0;
          top: 50%; transform: translateY(-50%);
          z-index: 1; text-align: center;
          pointer-events: none; overflow: hidden;
        }
        .h-bg-name-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900; font-style: italic;
          font-size: clamp(8rem, 16vw, 13rem);
          line-height: .88; color: #ff6a00;
          letter-spacing: -.01em; text-transform: uppercase;
          white-space: nowrap; display: inline-block;
          animation: h-slideUp .9s .1s cubic-bezier(.16,1,.3,1) both;
          will-change: transform;
          transition: transform .08s linear;
        }

        /* Glow */
        .h-glow {
          position: absolute; bottom: -60px; left: 50%;
          transform: translateX(-50%);
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,106,0,.14) 0%, transparent 70%);
          z-index: 3; pointer-events: none;
          animation: h-pulse-glow 3.5s ease-in-out infinite;
        }

        /* Image */
        .h-img-wrap {
          position: absolute;
          bottom: 46px; 
          left: 50%;
          transform: translateX(-42%);
          z-index: 4;
          height: 82%;
          display: flex; align-items: flex-end;
          will-change: transform;
          transition: transform .06s linear;
        }
        .h-img {
          height: 100%; width: auto;
          object-fit: contain; object-position: bottom;
          filter: drop-shadow(0 0 50px rgba(255,106,0,.15));
          animation: h-fi 1s .4s ease both;
          transition: filter .3s, transform .08s linear;
          cursor: crosshair;
        }
        .h-img-wrap:hover .h-img {
          filter: drop-shadow(0 0 80px rgba(255,106,0,.32));
        }

        /* Bottom row wrapper */
        .h-bottom-row {
          position: relative; z-index: 6;
          flex: 1; display: flex;
          align-items: flex-end;
          padding: 0 2.5rem 1.5rem;
          margin-top: auto;
        }

        /* ── Pop-up Re-design (Mimicking user image) ── */
        .h-webinar-popup {
          position: absolute;
          bottom: 25px; left: 25px;
          display: flex; align-items: center;
          transform: translateX(-120%);
          transition: transform .7s cubic-bezier(.19,1,.22,1);
          z-index: 1000;
        }
        .h-webinar-popup.show { transform: translateX(0); }

        .h-webinar-visual {
          width: 90px; height: 90px;
          background: #1a1a1a;
          border: 4px solid #ff6a00;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .h-webinar-visual::after {
          content: ''; position: absolute; inset: -3px;
          border: 1px solid rgba(255,106,0,0.5);
          border-radius: 50%; animation: h-broadcast 2s infinite;
        }

        .h-webinar-info {
          background: white;
          padding: 1rem 1.8rem 1rem 3.4rem;
          border-radius: 0 50px 50px 0;
          margin-left: -30px;
          display: flex; flex-direction: column; gap: 4px;
          box-shadow: 12px 10px 40px rgba(0,0,0,0.18);
          border: 1px solid #f1f5f9;
          min-width: 280px;
        }

        .h-webinar-top {
          display: flex; align-items: center; gap: 8px;
        }
        .h-webinar-live-tag {
          background: #1a1a1a; color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: .65rem;
          padding: .15rem .6rem; border-radius: 4px;
          display: flex; align-items: center; gap: 4px;
          letter-spacing: .05em;
        }
        .h-live-circle {
          width: 6px; height: 6px; background: #ff6a00;
          border-radius: 50%; animation: h-blink 1s infinite;
        }
        .h-webinar-main-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900; font-size: 2.2rem;
          color: #ff6a00; line-height: .9;
          margin: 0; text-transform: uppercase;
          letter-spacing: .02em;
        }
        .h-webinar-sub {
          font-size: .85rem; color: #64748b;
          font-weight: 700; text-transform: uppercase;
          letter-spacing: .06em; margin-top: 2px;
        }
        .h-webinar-arrow {
          position: absolute; right: 15px; top: 50%;
          transform: translateY(-50%);
          width: 38px; height: 38px; background: #ff6a00;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; color: #fff;
          box-shadow: 0 5px 12px rgba(255,106,0,0.35);
          transition: all .2s;
        }
        .h-webinar-info:hover .h-webinar-arrow {
          transform: translateY(-50%) scale(1.1);
          background: #000;
        }

        .h-webinar-close {
          position: absolute; top: -8px; right: -8px;
          width: 24px; height: 24px; background: #fff;
          border: 1px solid #eee; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          color: #999; transition: all .2s;
        }
        .h-webinar-close:hover { color: #ff6a00; transform: scale(1.1); }

        /* WhatsApp Card (Right) */
        .h-whatsapp-popup {
          position: absolute;
          bottom: 25px; right: 25px;
          width: 240px;
          background: white; border-radius: 16px;
          padding: 1rem;
          box-shadow: -10px 8px 30px rgba(0,0,0,0.1);
          display: flex; flex-direction: column; gap: 10px;
          transform: translateX(120%);
          transition: transform .7s .2s cubic-bezier(.19,1,.22,1);
          border: 1px solid #f1f5f9;
          z-index: 1000;
        }
        .h-whatsapp-popup.show { transform: translateX(0); }

        .h-wa-header {
          display: flex; justify-content: space-between; align-items: center;
        }
        .h-wa-tag {
          background: #e6fcf5; color: #25D366;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: .6rem;
          padding: .2rem .6rem; border-radius: 4px;
          text-transform: uppercase; letter-spacing: .05em;
        }
        .h-wa-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 1.1rem;
          color: #1e293b; text-transform: uppercase;
          line-height: 1.1; margin: 0;
        }
        .h-wa-btn {
          background: #25D366; color: #fff;
          font-size: .75rem; font-weight: 700;
          padding: .65rem; border-radius: 8px;
          text-align: center; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all .2s;
        }
        .h-wa-btn:hover { background: #20bd5a; transform: translateY(-1px); }

        /* Ticker */
        .h-ticker {
          background: #ff6a00; color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: .85rem; letter-spacing: .22em;
          padding: .6rem 0;
          overflow: hidden; z-index: 10; flex-shrink: 0;
        }
        .h-ticker:hover .h-ticker-track { animation-play-state: paused; }
        .h-ticker-track {
          display: flex; gap: 2.5rem;
          white-space: nowrap;
          animation: h-tick 22s linear infinite;
        }
        .h-ticker-track span { display: inline-flex; align-items: center; gap: 1.2rem; }
        .h-ticker-track span::after { content: '✦'; opacity: .45; font-size: .55rem; }

        /* Responsive */
        @media (max-width: 860px) {
          .h-hero        { height: auto; max-height: none; min-height: 600px; cursor: auto; padding-bottom: 2rem; }
          .h-cursor      { display: none; }
          .h-top-row     { padding: 2rem 1.5rem 1rem; grid-template-columns: 1fr; gap: 1rem; text-align: center; }
          .h-stats       { display: none; }
          .h-bg-name     { top: 40%; opacity: 0.15; }
          .h-bg-name-text{ font-size: clamp(3rem, 15vw, 6rem); }
          .h-img-wrap    { height: auto; position: relative; margin: 2rem auto 0; transform: none !important; left: 0; display: flex; justify-content: center; z-index: 4; }
          .h-img         { height: auto; max-height: 320px; width: auto; max-width: 100%; object-fit: contain; }
          .h-bottom-row  { flex-direction: column; align-items: center; gap: 0.75rem; padding: 0 1.5rem 1.5rem; position: relative; z-index: 10; margin-top: -2rem; }
          .h-webinar-popup, .h-whatsapp-popup {
            position: static; width: 100%; max-width: 320px; transform: none !important; margin: 0;
          }
          .h-webinar-visual { width: 55px; height: 55px; border-width: 3px; }
          .h-webinar-visual svg { width: 24px !important; height: 24px !important; }
          .h-webinar-info { margin-left: -15px; flex: 1; border-radius: 0 16px 16px 0; padding: 0.6rem 1rem 0.6rem 2.2rem; min-width: 0; }
          .h-webinar-main-title { font-size: 1.35rem; }
          .h-webinar-sub { font-size: 0.7rem; }
          .h-webinar-close { display: none; }
          .h-quote-text  { font-size: 1.1rem; line-height: 1.4; }
          .h-quote-mark  { font-size: 2.5rem; margin-bottom: 0.1rem; }
          .h-whatsapp-popup { padding: 0.75rem; gap: 8px; }
          .h-wa-title    { font-size: 0.95rem; }
          .h-wa-btn      { padding: 0.45rem; font-size: 0.7rem; border-radius: 6px; }
          .h-wa-tag      { font-size: 0.55rem; padding: 0.15rem 0.5rem; }
        }
      `}</style>

      <section className="h-hero" ref={heroRef}>

        <div className="h-cursor" ref={curRef} />

        <div className="h-content">

          {/* ── TOP ROW ── */}
          <div className="h-top-row">
            <div className="h-quote">
              <span className="h-quote-mark">"</span>
              <p className="h-quote-text">
                Your body carried life.<br/>
                Now let it carry strength,<br/>
                confidence &amp; pure joy.
              </p>
              <p className="h-quote-author">— Burn IT Out Fitness</p>
            </div>

            <div className="h-stats">
              <div className="h-stat">
                <div className="h-stat-num" data-target="10000" data-suffix="K+">10K+</div>
                <div className="h-stat-label">Moms Transformed</div>
              </div>
              <div className="h-stat">
                <div className="h-stat-num" data-target="50" data-suffix="+">50+</div>
                <div className="h-stat-label">Home Workouts</div>
              </div>
              <div className="h-stat">
                <div className="h-stat-num" data-target="49" data-suffix="★" data-decimal="true">4.9★</div>
                <div className="h-stat-label">Community Rating</div>
              </div>
            </div>
          </div>

          {/* ── BIG BG TEXT ── */}
          <div className="h-bg-name" aria-hidden="true">
            <span className="h-bg-name-text" ref={bgtextRef}>BURN IT OUT</span>
          </div>

          {/* ── GLOW BEHIND IMAGE ── */}
          <div className="h-glow" />

          {/* ── ATHLETE IMAGE ── */}
          <div className="h-img-wrap" ref={imgWrapRef}>
            <img
              ref={imgRef}
              src="/assets/tuhina-jump.jpg"
              alt="Fitness coach jumping with energy"
              className="h-img"
            />
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="h-bottom-row">
            
            {/* Webinar Pop-up (Mimicking Graphic) */}
            <div className={`h-webinar-popup ${showWebinarPopup ? 'show' : ''}`}>
              <div className="h-webinar-visual">
                <Video size={44} color="#ff6a00" fill="#ff6a00" strokeWidth={1.2} />
              </div>
              
              <Link href="/contact" className="h-webinar-info" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '2px', position: 'relative' }}>
                <div className="h-webinar-top">
                  <div className="h-webinar-live-tag">
                    <div className="h-live-circle" />
                    LIVE
                  </div>
                  <Radio size={14} color="#ff6a00" />
                </div>
                <h3 className="h-webinar-main-title">WEBINAR</h3>
                <span className="h-webinar-sub">Sustainable Fat Loss</span>
                
                <div className="h-webinar-arrow">
                  <ArrowRight size={18} />
                </div>
              </Link>
            </div>

            {/* WhatsApp Community Card */}
            <div className={`h-whatsapp-popup show`}>
              <div className="h-wa-header">
                <div className="h-wa-tag">Community</div>
                <div style={{ background: 'rgba(37, 211, 102, 0.1)', padding: '5px', borderRadius: '50%' }}>
                   <MessageCircle size={14} color="#25D366" fill="#25D366" />
                </div>
              </div>
              <h3 className="h-wa-title">Join 10K+ Support</h3>
              {settings?.whatsapp_link ? (
                <a href={settings.whatsapp_link} target="_blank" rel="noopener noreferrer" className="h-wa-btn">
                  Join Now <ArrowRight size={14} />
                </a>
              ) : (
                <button className="h-wa-btn" disabled style={{ background: '#eee', color: '#999' }}>
                  Soon
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ── TICKER ── */}
        <div className="h-ticker">
          <div className="h-ticker-track">
            {tickerWords.map((w, i) => <span key={i}>{w}</span>)}
          </div>
        </div>

      </section>
    </>
  );
}