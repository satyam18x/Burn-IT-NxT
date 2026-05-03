'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

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

    /* Magnetic button */
    const btn   = hero.querySelector('.h-webinar-btn');
    const wcard = hero.querySelector('.h-webinar');
    const magnetMove = (e) => {
      if (!btn) return;
      const r  = btn.getBoundingClientRect();
      const bx = e.clientX - r.left - r.width  / 2;
      const by = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translateY(-2px) translate(${bx * 0.18}px, ${by * 0.18}px)`;
    };
    const magnetLeave = () => { if (btn) btn.style.transform = ''; };
    if (wcard) {
      wcard.addEventListener('mousemove', magnetMove);
      wcard.addEventListener('mouseleave', magnetLeave);
    }

    /* Cursor big on interactive els */
    hero.querySelectorAll('.h-webinar, .h-session, .h-webinar-btn').forEach((el) => {
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
        border:2px solid #e8000b;
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
      if (wcard) {
        wcard.removeEventListener('mousemove', magnetMove);
        wcard.removeEventListener('mouseleave', magnetLeave);
      }
      if (img) img.removeEventListener('click', onImgClick);
      obs.disconnect();
    };
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
          background: #e8000b;
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
          color: #e8000b; line-height: .7;
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
          color: #e8000b;
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
          line-height: .88; color: #e8000b;
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
          background: radial-gradient(circle, rgba(232,0,11,.14) 0%, transparent 70%);
          z-index: 3; pointer-events: none;
          animation: h-pulse-glow 3.5s ease-in-out infinite;
        }

        /* Image */
        .h-img-wrap {
          position: absolute;
          bottom: 46px; /* sits above ticker */
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
          filter: drop-shadow(0 0 50px rgba(232,0,11,.15));
          animation: h-fi 1s .4s ease both;
          transition: filter .3s, transform .08s linear;
          cursor: crosshair;
        }
        .h-img-wrap:hover .h-img {
          filter: drop-shadow(0 0 80px rgba(232,0,11,.32));
        }

        /* Bottom row */
        .h-bottom-row {
          position: relative; z-index: 6;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 2.5rem 1rem;
          margin-top: auto;
          gap: 1rem;
        }

        /* Webinar card */
        .h-webinar {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          width: 260px; flex-shrink: 0;
          animation: h-fu .8s .55s ease both;
          transition: border-color .3s, background .3s;
        }
        .h-webinar:hover {
          background: rgba(255,255,255,.08);
          border-color: rgba(232,0,11,.4);
        }
        .h-live-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: #e8000b; color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: .65rem;
          letter-spacing: .1em; text-transform: uppercase;
          padding: .2rem .65rem; border-radius: 4px;
          margin-bottom: .6rem;
        }
        .h-live-dot {
          width: 5px; height: 5px; background: #fff;
          border-radius: 50%;
          animation: h-blink 1.4s infinite;
        }
        .h-webinar-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 1.08rem;
          color: #fff; text-transform: uppercase;
          letter-spacing: .02em; line-height: 1.22;
          margin-bottom: .75rem;
        }
        .h-webinar-btn {
          display: block; width: 100%;
          background: #e8000b; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: .76rem;
          padding: .6rem 1rem; border-radius: 6px;
          text-align: center; border: none;
          cursor: none; position: relative;
          overflow: hidden;
          transition: background .2s;
        }
        .h-webinar-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,.15);
          transform: translateX(-101%);
          transition: transform .3s;
        }
        .h-webinar-btn:hover::after { transform: translateX(0); }

        /* Session card */
        .h-session {
          background: #111;
          border: 1px solid #1f1f1f;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          width: 290px; flex-shrink: 0;
          animation: h-fu .8s .7s ease both;
          transition: border-color .3s;
        }
        .h-session:hover { border-color: rgba(232,0,11,.25); }
        .h-session-hdr {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: .75rem;
        }
        .h-session-badge {
          background: #e8000b; color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: .65rem;
          letter-spacing: .1em; text-transform: uppercase;
          padding: .2rem .65rem; border-radius: 100px;
        }
        .h-session-time { color: #444; font-size: .7rem; font-weight: 500; }
        .h-session-row { display: flex; align-items: center; gap: .7rem; }
        .h-session-icon {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,.06);
          display: flex; align-items: center; justify-content: center;
          font-size: .88rem; flex-shrink: 0;
          transition: background .2s;
        }
        .h-session:hover .h-session-icon { background: rgba(232,0,11,.12); }
        .h-session-vs {
          width: 22px; height: 22px;
          background: rgba(255,255,255,.05); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: .58rem; color: #444; flex-shrink: 0;
        }
        .h-session-label {
          font-weight: 600; font-size: .82rem;
          color: #fff; line-height: 1.1;
        }
        .h-session-footer {
          display: flex; justify-content: space-between;
          margin-top: .75rem; padding-top: .75rem;
          border-top: 1px solid #1e1e1e;
        }
        .h-session-footer-label { font-size: .65rem; color: #444; }
        .h-session-footer-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: .75rem;
          color: #555; letter-spacing: .05em; text-transform: uppercase;
        }

        /* Ticker */
        .h-ticker {
          background: #e8000b; color: #fff;
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
          .h-hero        { height: auto; max-height: none; min-height: 520px; cursor: auto; }
          .h-cursor      { display: none; }
          .h-top-row     { padding: 1.5rem 1.5rem 0; grid-template-columns: 1fr; }
          .h-stats       { flex-direction: row; align-items: flex-start; gap: 1.5rem; }
          .h-bg-name-text{ font-size: clamp(4rem, 18vw, 8rem); }
          .h-img-wrap    { height: 60%; }
          .h-bottom-row  { flex-direction: column; align-items: stretch; gap: .8rem; padding: 0 1.5rem 1rem; }
          .h-webinar, .h-session { width: 100%; }
          .h-quote-text  { font-size: 1.1rem; }
        }
      `}</style>

      <section className="h-hero" ref={heroRef}>

        {/* Custom cursor */}
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

            {/* Webinar / CTA card */}
            <div className="h-webinar">
              <div className="h-live-tag">
                <div className="h-live-dot" />
                Live Webinar
              </div>
              <div className="h-webinar-title">
                Sustainable Fat Loss<br />Masterclass
              </div>
              {settings?.webinar_link ? (
                <a
                  href={settings.webinar_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-webinar-btn"
                >
                  Reserve My Spot Now →
                </a>
              ) : (
                <button className="h-webinar-btn" disabled
                  style={{ background: '#333', color: '#666', cursor: 'not-allowed' }}>
                  Coming Soon
                </button>
              )}
            </div>

            {/* Next session info */}
            <div className="h-session">
              <div className="h-session-hdr">
                <span className="h-session-badge">Next Live Session</span>
                <span className="h-session-time">Today · 07:00 AM</span>
              </div>
              <div className="h-session-row">
                <div className="h-session-icon">🔥</div>
                <span className="h-session-label">Morning Burn</span>
                <div className="h-session-vs">+</div>
                <div className="h-session-icon">💪</div>
                <span className="h-session-label">Core Strength</span>
              </div>
              <div className="h-session-footer">
                <span className="h-session-footer-label">Program</span>
                <span className="h-session-footer-val">Moms Reborn · Week 3</span>
              </div>
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