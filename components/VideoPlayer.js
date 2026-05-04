'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const extractVideoId = (urlOrId) => {
  if (!urlOrId) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlOrId.match(regExp);
  return match && match[2].length === 11 ? match[2] : (urlOrId.length === 11 ? urlOrId : null);
};

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoPlayer({ youtubeId, userEmail, onEnded }) {
  const playerRef = useRef(null);
  const iframeContainerRef = useRef(null); // stable React-managed wrapper div
  const mountElRef = useRef(null);          // manually created div — YT can replace it freely
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const intervalRef = useRef(null);
  const hideControlsRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const containerRef = useRef(null);

  const videoId = extractVideoId(youtubeId);

  const startHideTimer = useCallback(() => {
    clearTimeout(hideControlsRef.current);
    setShowControls(true);
    hideControlsRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  // Block right-click and dev shortcuts globally
  useEffect(() => {
    const noCtxMenu = (e) => e.preventDefault();
    const noKeys = (e) => {
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && [73, 74, 75, 85, 67].includes(e.keyCode)) ||
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('contextmenu', noCtxMenu);
    document.addEventListener('keydown', noKeys);
    return () => {
      document.removeEventListener('contextmenu', noCtxMenu);
      document.removeEventListener('keydown', noKeys);
    };
  }, []);

  // Load YT IFrame API
  useEffect(() => {
    if (!videoId) return;

    // Create a fresh div for YT to mount into — not managed by React
    const mountEl = document.createElement('div');
    mountEl.style.width = '100%';
    mountEl.style.height = '100%';
    mountElRef.current = mountEl;

    const loadPlayer = () => {
      if (!iframeContainerRef.current || playerRef.current) return;
      iframeContainerRef.current.appendChild(mountEl);

      playerRef.current = new window.YT.Player(mountEl, {
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.protocol + '//' + window.location.host,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(volume);
            setDuration(e.target.getDuration());
            setIsReady(true);
          },
          onStateChange: (e) => {
            const YTState = window.YT.PlayerState;
            if (e.data === YTState.PLAYING) {
              setIsPlaying(true);
              setIsBuffering(false);
              setDuration(playerRef.current.getDuration());
            } else if (e.data === YTState.PAUSED) {
              setIsPlaying(false);
            } else if (e.data === YTState.ENDED) {
              setIsPlaying(false);
              if (onEnded) onEnded();
            } else if (e.data === YTState.BUFFERING) {
              setIsBuffering(true);
            }
          },
          onError: (e) => {
            console.error('YouTube Player Error:', e.data);
          }
        },
      });
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        loadPlayer();
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(hideControlsRef.current);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      // Safely remove the mount element only if it's still a child
      if (mountEl.parentNode) {
        mountEl.parentNode.removeChild(mountEl);
      }
      mountElRef.current = null;
      setIsReady(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };
  }, [videoId]);

  // Time ticker
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current?.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 500);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Fullscreen listener
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    startHideTimer();
  };

  const handleSeek = (e) => {
    if (!playerRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pct * duration;
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
    startHideTimer();
  };

  const handleVolume = (e) => {
    if (!playerRef.current || !volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const v = Math.round(pct * 100);
    setVolume(v);
    setIsMuted(v === 0);
    playerRef.current.setVolume(v);
    if (v > 0) playerRef.current.unMute();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume || 50);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
    startHideTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    startHideTimer();
  };

  const setSpeed = (rate) => {
    if (playerRef.current) playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    startHideTimer();
  };

  const skip = (secs) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(currentTime + secs, true);
    startHideTimer();
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!videoId) {
    return (
      <div style={styles.placeholder}>
        <div style={styles.placeholderIcon}>▶</div>
        <p style={{ color: '#888', marginTop: '1rem' }}>Select a video to start watching</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ ...styles.wrapper, cursor: showControls ? 'default' : 'none' }}
      onMouseMove={startHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={() => setShowSpeedMenu(false)}
    >
      {/* YouTube IFrame stable mount wrapper — YT appends its own children here */}
      <div id="yt-inner-container" ref={iframeContainerRef} style={styles.ytContainer} />

      {/* Transparent click-capture overlay (blocks direct iframe interaction) */}
      <div
        style={styles.captureLayer}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />

      {/* Buffering Spinner */}
      {isBuffering && (
        <div style={styles.bufferOverlay}>
          <div style={styles.spinner} />
        </div>
      )}

      {/* Watermark */}
      <div style={styles.watermark}>{userEmail}</div>

      {/* Controls */}
      <div style={{ ...styles.controls, opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'all' : 'none' }}>
        {/* Progress Bar */}
        <div
          ref={progressRef}
          style={styles.progressTrack}
          onClick={handleSeek}
          onMouseDown={handleSeek}
        >
          <div style={{ ...styles.progressFill, width: `${progressPct}%` }}>
            <div style={styles.progressThumb} />
          </div>
        </div>

        {/* Bottom Controls */}
        <div style={styles.bottomBar}>
          {/* Left controls */}
          <div style={styles.controlGroup}>
            {/* Skip back */}
            <button style={styles.ctrlBtn} onClick={() => skip(-10)} title="Rewind 10s">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/><text x="8" y="16" fontSize="6" fill="white" fontFamily="Arial">10</text></svg>
            </button>

            {/* Play/Pause */}
            <button style={{ ...styles.ctrlBtn, ...styles.playBtn }} onClick={togglePlay}>
              {isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
              )}
            </button>

            {/* Skip forward */}
            <button style={styles.ctrlBtn} onClick={() => skip(10)} title="Forward 10s">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/><text x="8" y="16" fontSize="6" fill="white" fontFamily="Arial">10</text></svg>
            </button>

            {/* Volume */}
            <button style={styles.ctrlBtn} onClick={toggleMute}>
              {isMuted || volume === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7 7 9H4v6h3l4 4V13.41l3.17 3.17c-.51.38-1.06.69-1.67.88v2.06c1.01-.27 1.93-.73 2.74-1.34l2.04 2.04a.996.996 0 1 0 1.41-1.41L5.05 3.63a.996.996 0 0 0-1.42 0zm14.66 9c0 1.02-.22 1.99-.61 2.87l1.47 1.47C19.69 15.72 20 14.4 20 13c0-3.81-2.5-7.06-6-8.19V6.88c2.28.98 4 3.27 4 5.75l-.71-.01zM19 13c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM11 4L8.56 6.44 11 8.88V4z"/></svg>
              ) : volume < 50 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              )}
            </button>
            <div
              ref={volumeRef}
              style={styles.volumeTrack}
              onClick={handleVolume}
            >
              <div style={{ ...styles.volumeFill, width: `${isMuted ? 0 : volume}%` }} />
            </div>

            {/* Time */}
            <span style={styles.timeLabel}>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>

          {/* Right controls */}
          <div style={styles.controlGroup}>
            {/* Speed */}
            <div style={{ position: 'relative' }}>
              <button style={styles.ctrlBtn} onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(p => !p); }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white' }}>{playbackRate}x</span>
              </button>
              {showSpeedMenu && (
                <div style={styles.speedMenu} onClick={e => e.stopPropagation()}>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(r => (
                    <div
                      key={r}
                      style={{ ...styles.speedItem, background: playbackRate === r ? 'rgba(255,140,0,0.3)' : 'transparent' }}
                      onClick={() => setSpeed(r)}
                    >
                      {r}x
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button style={styles.ctrlBtn} onClick={toggleFullscreen}>
              {isFullscreen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Big play button when paused & controls visible */}
      {!isPlaying && showControls && isReady && !isBuffering && (
        <button style={styles.bigPlayBtn} onClick={togglePlay}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
        </button>
      )}

      {/* Brand logo */}
      <div style={styles.brandBadge}>BURN IT</div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .vp-progress-track:hover .vp-progress-thumb { transform: scale(1.3) !important; }
        #yt-inner-container iframe,
        #yt-inner-container > div {
          width: 100% !important;
          height: 100% !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    fontFamily: 'Inter, sans-serif',
  },
  ytContainer: {
    position: 'absolute',
    top: '-56px',
    left: '-4px',
    right: '-4px',
    bottom: '-56px',
    overflow: 'hidden',
  },
  captureLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    background: 'transparent',
  },
  bufferOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.3)',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(255,255,255,0.2)',
    borderTop: '4px solid #ff8c00',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  watermark: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '4px 10px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: 'rgba(255,255,255,0.35)',
    fontSize: '0.7rem',
    borderRadius: '4px',
    zIndex: 30,
    pointerEvents: 'none',
    letterSpacing: '0.02em',
  },
  brandBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    padding: '4px 12px',
    background: 'linear-gradient(135deg, #ff8c00, #ff4500)',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: '800',
    borderRadius: '4px',
    zIndex: 30,
    pointerEvents: 'none',
    letterSpacing: '0.1em',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
    padding: '40px 16px 14px',
    transition: 'opacity 0.3s ease',
  },
  progressTrack: {
    position: 'relative',
    height: '4px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    marginBottom: '12px',
    cursor: 'pointer',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff8c00, #ff4500)',
    borderRadius: '4px',
    position: 'relative',
    transition: 'width 0.3s linear',
  },
  progressThumb: {
    position: 'absolute',
    right: '-6px',
    top: '50%',
    transform: 'translateY(-50%) scale(1)',
    width: '12px',
    height: '12px',
    background: '#ff8c00',
    borderRadius: '50%',
    boxShadow: '0 0 6px rgba(255,140,0,0.8)',
    transition: 'transform 0.15s ease',
  },
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  ctrlBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
    outline: 'none',
  },
  playBtn: {
    background: 'rgba(255,140,0,0.15)',
    borderRadius: '50%',
    padding: '8px',
  },
  volumeTrack: {
    width: '64px',
    height: '4px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    background: 'white',
    borderRadius: '4px',
  },
  timeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.75rem',
    marginLeft: '8px',
    whiteSpace: 'nowrap',
    letterSpacing: '0.02em',
  },
  speedMenu: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    background: 'rgba(20,20,20,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    minWidth: '80px',
    zIndex: 50,
    backdropFilter: 'blur(8px)',
  },
  speedItem: {
    padding: '8px 16px',
    color: 'white',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background 0.15s ease',
  },
  bigPlayBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(255,140,0,0.25)',
    backdropFilter: 'blur(4px)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 35,
    transition: 'transform 0.2s ease, background 0.2s ease',
  },
  placeholder: {
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#111',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
  },
  placeholderIcon: {
    fontSize: '3rem',
    color: '#ff8c00',
  },
};
