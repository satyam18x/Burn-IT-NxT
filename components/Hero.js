import Link from 'next/link';

export default function HeroSection() {
  const tickerWords = [
    'Cardio', 'Strength', 'Nutrition', 'Mindfulness',
    'Postpartum Recovery', 'Dance Fitness', 'Yoga', 'Zumba',
    'Cardio', 'Strength', 'Nutrition', 'Mindfulness',
    'Postpartum Recovery', 'Dance Fitness', 'Yoga', 'Zumba',
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,900&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --h-red: #e8000b;
          --h-black: #111111;
          --h-white: #ffffff;
          --h-muted: #888888;
        }

        /* ── NAVBAR ── */
        .h-nav {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          padding: 1.4rem 2.5rem;
          gap: 1.4rem;
        }
        .h-nav-logo {
          width: 52px; height: 52px;
          background: var(--h-red);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          text-decoration: none;
        }
        .h-nav-logo span {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 0.68rem;
          color: white;
          text-align: center;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .h-nav-identity {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .h-nav-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--h-black);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1;
        }
        .h-nav-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          color: var(--h-muted);
        }
        .h-nav-links {
          display: flex;
          gap: 2rem;
          margin-left: auto;
          align-items: center;
        }
        .h-nav-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: var(--h-black);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }
        .h-nav-link::before {
          content: '';
          width: 6px; height: 6px;
          border: 1.5px solid currentColor;
          border-radius: 50%;
          display: block;
          opacity: 0.5;
        }
        .h-nav-link:hover { color: var(--h-red); }
        .h-nav-social {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: 2rem;
          padding-left: 2rem;
          border-left: 1px solid #e0e0e0;
        }
        .h-nav-social a {
          color: var(--h-black);
          text-decoration: none;
          opacity: 0.55;
          transition: opacity 0.15s, color 0.15s;
          display: flex;
        }
        .h-nav-social a:hover { opacity: 1; color: var(--h-red); }

        /* ── HERO WRAPPER ── */
        .h-hero {
          position: relative;
          width: 100%;
          height: 88vh;
          min-height: 560px;
          max-height: 860px;
          background: var(--h-black);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
        }

        /* Hide internal nav — site already has a Header */
        .h-nav { display: none; }

        /* ── CONTENT LAYER ── */
        .h-content {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* ── TOP ROW ── */
        .h-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 2.5rem 2.5rem 0;
          position: relative;
          z-index: 5;
        }
        .h-quote { max-width: 420px; animation: h-fadeUp 0.7s 0.1s ease both; }
        .h-quote-mark {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 4rem;
          color: var(--h-white);
          line-height: 0.8;
          display: block;
          margin-bottom: 0.4rem;
        }
        .h-quote-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 1.75rem;
          line-height: 1.3;
          color: var(--h-white);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .h-quote-author {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: var(--h-muted);
          margin-top: 0.8rem;
          font-weight: 500;
        }

        /* Hatched number — top right */
        .h-big-number {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(6rem, 10vw, 9rem);
          line-height: 1;
          color: transparent;
          background-image: repeating-linear-gradient(
            -55deg,
            #c0c0c0 0px, #c0c0c0 1.5px,
            transparent 1.5px, transparent 9px
          );
          -webkit-background-clip: text;
          background-clip: text;
          letter-spacing: -0.02em;
          user-select: none;
          animation: h-fadeIn 1s 0.5s ease both;
        }

        /* ── GIANT BG NAME TEXT ── */
        .h-bg-name {
          position: absolute;
          left: 0; right: 0;
          bottom: 10%;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
          text-align: center;
        }
        .h-bg-name-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: clamp(9rem, 17.5vw, 16rem);
          line-height: 0.85;
          color: #ff4500;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
          animation: h-slideUp 0.9s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* ── ATHLETE IMAGE ── */
        .h-img-wrap {
          position: absolute;
          bottom: 6%;
          left: 50%;
          transform: translateX(-46%);
          z-index: 3;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .h-img {
          height: 100%;
          width: auto;
          object-fit: contain;
          object-position: bottom;
          filter: drop-shadow(0 10px 40px rgba(0,0,0,0.08));
          animation: h-fadeIn 1s 0.35s ease both;
        }

        /* ── BOTTOM CARDS ── */
        .h-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 2.5rem 1.6rem;
          position: relative;
          z-index: 5;
          margin-top: auto;
        }

        /* Video card */
        .h-video-card {
          width: 230px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
          animation: h-fadeUp 0.8s 0.5s ease both;
          flex-shrink: 0;
        }
        .h-video-thumb {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
        }
        .h-video-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #fce4e1 0%, #e8f7f5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          color: #aaa;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .h-play-btn {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 40px; height: 40px;
          background: var(--h-red);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(232,0,11,0.5);
        }

        /* Session card */
        .h-session-card {
          background: var(--h-black);
          border-radius: 10px;
          padding: 1.1rem 1.5rem;
          width: 310px;
          flex-shrink: 0;
          animation: h-fadeUp 0.8s 0.65s ease both;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .h-session-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }
        .h-session-badge {
          display: inline-block;
          background: var(--h-red);
          color: white;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.22rem 0.75rem;
          border-radius: 100px;
        }
        .h-session-time {
          color: rgba(255,255,255,0.45);
          font-size: 0.76rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
        }
        .h-session-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .h-session-icon {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.09);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .h-session-vs {
          width: 26px; height: 26px;
          background: rgba(255,255,255,0.07);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          flex-shrink: 0;
        }
        .h-session-label {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.86rem;
          color: white;
          line-height: 1.1;
        }
        .h-session-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 0.85rem;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .h-session-footer-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.35);
        }
        .h-session-footer-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ── TICKER ── */
        .h-ticker {
          background: #FF5A00;
          color: white;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.88rem;
          letter-spacing: 0.22em;
          padding: 0.65rem 0;
          overflow: hidden;
          z-index: 10;
          flex-shrink: 0;
        }
        .h-ticker-track {
          display: flex;
          gap: 2.5rem;
          white-space: nowrap;
          animation: h-ticker 22s linear infinite;
        }
        .h-ticker-track span {
          display: inline-flex;
          align-items: center;
          gap: 1.2rem;
        }
        .h-ticker-track span::after { content: '✦'; opacity: 0.5; font-size: 0.6rem; }

        /* ── KEYFRAMES ── */
        @keyframes h-fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes h-fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes h-slideUp {
          from { opacity: 0; transform: translateY(60px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes h-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .h-hero { height: auto; max-height: none; min-height: 520px; }
          .h-big-number { font-size: 4.5rem; }
          .h-bg-name-text { font-size: clamp(4.5rem, 18vw, 9rem); }
          .h-top-row { padding: 1.5rem 1.5rem 0; }
          .h-bottom-row { flex-direction: column; align-items: flex-start; gap: 0.8rem; padding: 0 1.5rem 1rem; }
          .h-session-card, .h-video-card { width: 100%; max-width: 320px; }
          .h-img-wrap { height: 65%; }
          .h-quote-text { font-size: 0.88rem; }
          .h-big-number { font-size: clamp(3.5rem, 10vw, 5rem); }
        }
      `}</style>

      <section className="h-hero">

        {/* ── CONTENT ── */}
        <div className="h-content">

          {/* Top: quote left, hatched number right */}
          <div className="h-top-row">
            <div className="h-quote">
              <span className="h-quote-mark">"</span>
              <p className="h-quote-text">
                Your body carried life.<br/>
                Now let it carry strength,<br/>
                confidence &amp; pure joy.
              </p>
              <p className="h-quote-author">Burn IT Out Fitness</p>
            </div>
            <div className="h-big-number" aria-hidden="true">10K+</div>
          </div>

          {/* Big red name behind athlete */}
          <div className="h-bg-name" aria-hidden="true">
            <span className="h-bg-name-text">BURN IT OUT</span>
          </div>

          {/* Jumping image — centered, in front */}
          <div className="h-img-wrap">
            <img
              src="/assets/tuhina-jump.jpg"
              alt="Fitness coach jumping with energy"
              className="h-img"
            />
          </div>

          {/* Bottom row */}
          <div className="h-bottom-row"></div>
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
