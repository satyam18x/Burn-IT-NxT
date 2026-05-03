'use client';

import { useEffect } from 'react';

const REELS = [
  'https://www.instagram.com/reel/DTLGm9bgQG6/',
  'https://www.instagram.com/reel/DXri6mBjIg4/',
  'https://www.instagram.com/reel/DXRhsLmDFLq/',
];

export default function InstagramFeed() {
  useEffect(() => {
    // If script already exists, just re-process existing embeds
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }

    // Inject the Instagram embed script once
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      {REELS.map((url) => (
        <blockquote
          key={url}
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: '0',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            margin: '0',
            maxWidth: '328px',
            minWidth: '280px',
            width: '100%',
          }}
        />
      ))}
    </div>
  );
}
