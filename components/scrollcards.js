'use client';

// 6 BEFORE images — one person's journey start
const beforeImages = [
  '/assets/before1.jpg',
  '/assets/before2.jpg',
  '/assets/before3.jpg',
  '/assets/before4.jpg',
  '/assets/before5.jpg',
  '/assets/before6.jpg',
];

// 4 AFTER images — the same person, transformed
const afterImages = [
  '/assets/after1.jpg',
  '/assets/after2.jpg',
  '/assets/after3.jpg',
  '/assets/after4.jpg',
  '/assets/after5.jpg',
  '/assets/after6.jpg',
];

export default function TransformationSection() {
  return (
    <>
      <style>{`
        /* ── SECTION ── */
        .tr-section {
          background: #0e0e0e;
          padding: 4rem 0 0;
          overflow: hidden;
        }

        /* ── HEADING ── */
        .tr-heading {
          text-align: center;
          padding: 0 2rem 3rem;
        }
        .tr-heading-eyebrow {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF5A00;
          margin-bottom: 0.8rem;
          font-family: 'DM Sans', sans-serif;
        }
        .tr-heading-title {
          font-family: 'Barlow Condensed', 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: clamp(2.5rem, 6vw, 4rem);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #fff;
          line-height: 1;
        }
        .tr-heading-title span { color: #FF5A00; }

        /* ── SPLIT LAYOUT ── */
        .tr-split {
          display: flex;
          align-items: stretch;
          height: 440px;
        }

        /* ── EACH HALF ── */
        .tr-half {
          width: 50%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* ── LABEL BAR ── */
        .tr-label-bar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 1.5rem;
          flex-shrink: 0;
        }
        .tr-before .tr-label-bar { background: #1a1a1a; }
        .tr-after  .tr-label-bar { background: #1a0a00; }

        .tr-label-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tr-before .tr-label-dot { background: rgba(255,255,255,0.35); }
        .tr-after  .tr-label-dot { background: #FF5A00; }

        .tr-label-text {
          font-family: 'Barlow Condensed', 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .tr-before .tr-label-text { color: rgba(255,255,255,0.4); }
        .tr-after  .tr-label-text { color: #FF5A00; }

        /* ── SCROLL STRIP ── */
        .tr-scroll {
          flex: 1;
          overflow-x: scroll;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          display: flex;
          align-items: stretch;
          padding: 0 1.5rem 0;
          gap: 8px;
          cursor: grab;
          scrollbar-width: none;
        }
        .tr-scroll:active { cursor: grabbing; }
        .tr-scroll::-webkit-scrollbar { display: none; }

        /* ── IMAGE CARD ── */
        .tr-img-card {
          flex-shrink: 0;
          width: 200px;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        .tr-img-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.4s ease;
        }
        .tr-img-card:hover img { transform: scale(1.04); }

        /* BEFORE: desaturated + dark */
        .tr-before .tr-img-card img {
          filter: saturate(0.35) brightness(0.82);
        }
        .tr-before .tr-img-card {
          border: 1px solid rgba(255,255,255,0.05);
        }

        /* AFTER: full vibrant color */
        .tr-after .tr-img-card img {
          filter: saturate(1.08) brightness(1.03);
        }
        .tr-after .tr-img-card {
          border: 1px solid rgba(255,90,0,0.2);
        }

        /* ── CENTRE DIVIDER ── */
        .tr-divider {
          width: 3px;
          background: linear-gradient(to bottom, transparent, #FF5A00 30%, #FF5A00 70%, transparent);
          position: relative;
          flex-shrink: 0;
          z-index: 10;
        }
        .tr-divider-arrow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #FF5A00;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: white;
          box-shadow: 0 0 0 6px rgba(255,90,0,0.15), 0 8px 30px rgba(255,90,0,0.4);
        }

        /* ── SCROLL PADDING END ── */
        .tr-scroll-end {
          flex-shrink: 0;
          width: 1.5rem;
        }

        /* ── FOOTER HINT ── */
        .tr-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.2rem;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.22);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }
        .tr-hint-line {
          width: 40px;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }

        @media (max-width: 640px) {
          .tr-split { height: 320px; }
          .tr-img-card { width: 150px; }
          .tr-heading-title { font-size: 2rem; }
        }
      `}</style>

      <section className="tr-section">
        {/* Heading */}
        <div className="tr-heading">
          <div className="tr-heading-eyebrow">One Journey · Real Results</div>
          <h2 className="tr-heading-title">
            Before <span>&</span> After
          </h2>
        </div>

        {/* Split */}
        <div className="tr-split">

          {/* ── LEFT: BEFORE ── */}
          <div className="tr-half tr-before">
            <div className="tr-label-bar">
              <div className="tr-label-dot" />
              <span className="tr-label-text">Before</span>
            </div>
            <div className="tr-scroll">
              {beforeImages.map((src, i) => (
                <div className="tr-img-card" key={i}>
                  <img src={src} alt={`Before ${i + 1}`} loading="lazy" />
                </div>
              ))}
              <div className="tr-scroll-end" />
            </div>
          </div>

          {/* ── CENTRE DIVIDER ── */}
          <div className="tr-divider">
            <div className="tr-divider-arrow">→</div>
          </div>

          {/* ── RIGHT: AFTER ── */}
          <div className="tr-half tr-after">
            <div className="tr-label-bar">
              <div className="tr-label-dot" />
              <span className="tr-label-text">After</span>
            </div>
            <div className="tr-scroll">
              {afterImages.map((src, i) => (
                <div className="tr-img-card" key={i}>
                  <img src={src} alt={`After ${i + 1}`} loading="lazy" />
                </div>
              ))}
              <div className="tr-scroll-end" />
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="tr-hint">
          <div className="tr-hint-line" />
          scroll each side
          <div className="tr-hint-line" />
        </div>
      </section>
    </>
  );
}