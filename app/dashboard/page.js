'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, BookOpen, Activity, Users, ArrowRight, ArrowLeft, Loader2, CheckCircle2, ChevronDown, ChevronUp, LogOut, Layout, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [youtubeId, setYoutubeId] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [progressStats, setProgressStats] = useState({ total: 0, watched: 0, percentage: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
    fetchMyCourses();
    fetchWatchedVideos();

    // Close sidebar by default on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [router]);

  const fetchWatchedVideos = async () => {
    try {
      const res = await fetch('/api/user/progress');
      if (res.ok) {
        const data = await res.json();
        setWatchedVideos(data);
      }
    } catch (err) {
      console.error('Fetch progress error:', err);
    }
  };

  const fetchProgressStats = async (courseId) => {
    try {
      const res = await fetch(`/api/user/progress?courseId=${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setProgressStats(data);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const fetchMyCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await fetch('/api/user/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
        // Auto-load the first course's details into the video player
        if (data.length > 0) {
          fetchCourseDetails(data[0].id);
        }
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (err) {
      console.error('Fetch courses error:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const res = await fetch(`/api/user/course/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveCourse(data);
        fetchProgressStats(courseId);
        if (data.modules && data.modules.length > 0) {
          const firstMod = data.modules[0];
          if (firstMod.videos && firstMod.videos.length > 0) {
            handleSelectVideo(firstMod.videos[0]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const handleSelectVideo = async (video) => {
    setActiveVideo(video);
    setLoadingVideo(true);
    setYoutubeId(null);
    try {
      const res = await fetch(`/api/video/${video.id}`);
      if (res.ok) {
        const data = await res.json();
        setYoutubeId(data.youtube_id);
      } else {
        console.error('Failed to fetch video access');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVideo(false);
    }
  };

  const markAsWatched = async (videoId) => {
    try {
      const res = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId })
      });
      if (res.ok) {
        if (!watchedVideos.includes(videoId)) {
          setWatchedVideos([...watchedVideos, videoId]);
          if (activeCourse) {
            fetchProgressStats(activeCourse.id);
          }
        }
      }
    } catch (err) {
      console.error('Mark watched error:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const allVideos = activeCourse?.modules?.flatMap(mod => mod.videos || []) || [];
  const currentIndex = allVideos.findIndex(v => v.id === activeVideo?.id);

  const handleNextVideo = () => {
    if (currentIndex < allVideos.length - 1) {
      handleSelectVideo(allVideos[currentIndex + 1]);
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      handleSelectVideo(allVideos[currentIndex - 1]);
    }
  };

  const handleVideoEnded = () => {
    markAsWatched(activeVideo.id);
    handleNextVideo();
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Sidebar for Curriculum */}
      <div style={{ zIndex: 100, position: 'relative' }}>
        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1900,
              display: typeof window !== 'undefined' && window.innerWidth < 1024 ? 'block' : 'none'
            }}
            className="mobile-overlay"
          />
        )}

        <aside style={{ 
          width: '320px', 
          maxWidth: '85vw',
          backgroundColor: '#1e293b', 
          color: 'white', 
          display: 'flex', 
          flexDirection: 'column', 
          transition: 'transform 0.3s ease',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          boxShadow: isSidebarOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
          zIndex: 2000
        }} className="sidebar">
          <div style={{ 
            height: '70px',
            padding: '0 1.5rem', 
            borderBottom: '1px solid rgba(255,255,255,0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexShrink: 0,
            position: 'relative'
          }}>
            <h2 style={{ fontSize: '1.1rem', color: 'white', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              <span style={{ color: 'var(--color-primary)' }}>Burn</span> IT
            </h2>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                padding: '8px', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                zIndex: 110
              }} 
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}>
            {/* Course Selector Dropdown (Simplified) */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Active Program</label>
              <select 
                value={activeCourse?.id || ''} 
                onChange={(e) => fetchCourseDetails(e.target.value)}
                style={{ 
                  width: '100%', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  color: 'white', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px', 
                  padding: '0.75rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {courses.map(c => <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.title}</option>)}
              </select>
            </div>

            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: '700', marginBottom: '1rem', display: 'block' }}>Course Curriculum</label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {activeCourse?.modules?.flatMap(mod => mod.videos || []).map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  style={{
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: activeVideo?.id === video.id ? 'var(--color-primary)' : 'transparent',
                    color: activeVideo?.id === video.id ? 'white' : 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={(e) => { if (activeVideo?.id !== video.id) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { if (activeVideo?.id !== video.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {watchedVideos.includes(video.id) ? 
                    <CheckCircle2 size={16} color={activeVideo?.id === video.id ? 'white' : '#4ade80'} /> : 
                    <PlayCircle size={16} opacity={0.5} />
                  }
                  <span style={{ flex: 1, fontWeight: '500' }}>{video.title}</span>
                </div>
              ))}
            </div>
          </div>


        </aside>
      </div>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative', 
        overflowY: 'auto',
        marginLeft: (isSidebarOpen && typeof window !== 'undefined' && window.innerWidth >= 768) ? '320px' : '0',
        transition: 'margin-left 0.3s ease'
      }} className="main-content">
        {/* Top Header */}
        <header style={{ 
          height: '70px', 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e2e8f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }} className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
              {activeCourse ? activeCourse.title : 'Dashboard'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }} className="desktop-only">
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>{user.name}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Student</span>
            </div>
          </div>
        </header>

        {/* Video & Content Area */}
        <div style={{ flex: 1, padding: '1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }} className="content-container">
          {activeCourse ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Video Player Card */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={handlePrevVideo} 
                      disabled={currentIndex <= 0}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #e2e8f0', 
                        background: currentIndex <= 0 ? '#f8fafc' : 'white',
                        cursor: currentIndex <= 0 ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: currentIndex <= 0 ? '#cbd5e1' : '#475569'
                      }}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <button 
                      onClick={handleNextVideo} 
                      disabled={currentIndex >= allVideos.length - 1}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #e2e8f0', 
                        background: currentIndex >= allVideos.length - 1 ? '#f8fafc' : 'white',
                        cursor: currentIndex >= allVideos.length - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: currentIndex >= allVideos.length - 1 ? '#cbd5e1' : '#475569'
                      }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                    Lesson {currentIndex + 1} of {allVideos.length}
                  </div>
                </div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: 'black' }}>
                  <VideoPlayer 
                    youtubeId={youtubeId} 
                    userEmail={user.email} 
                    onEnded={handleVideoEnded}
                  />
                  {loadingVideo && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 }}>
                      <Loader2 size={40} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="video-info-header">
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem' }}>
                      {activeVideo ? activeVideo.title : 'Select a lesson'}
                    </h2>

                  </div>
                  
                  <button 
                    className="btn" 
                    onClick={() => activeVideo && markAsWatched(activeVideo.id)}
                    disabled={!activeVideo || watchedVideos.includes(activeVideo?.id)}
                    style={{ 
                      background: watchedVideos.includes(activeVideo?.id) ? '#10b981' : 'var(--color-primary)', 
                      color: 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(255, 106, 0, 0.25)',
                      width: '100%',
                      maxWidth: '300px'
                    }}
                  >
                    {watchedVideos.includes(activeVideo?.id) ? <><CheckCircle2 size={18} /> Completed</> : 'Mark as Completed'}
                  </button>
                </div>

                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#334155', marginBottom: '1rem' }}>About this lesson</h3>
                  <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {activeVideo?.description || "In this session, we'll cover the fundamental techniques and principles to help you achieve your fitness goals. Make sure to follow along and stay hydrated throughout the workout."}
                  </p>
                </div>
              </div>

              {/* Extras Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#1e293b' }}>
                    <Activity color="var(--color-primary)" size={20} /> Overall Course Progress
                  </h4>
                  <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '700' }}>Completion Status</span>
                      <span style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: '800' }}>{progressStats.percentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressStats.percentage}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '1rem', fontWeight: '500' }}>
                      You've completed {progressStats.watched} out of {progressStats.total} videos. Keep it up!
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#1e293b' }}>
                    <Users color="var(--color-primary)" size={20} /> Community Support
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Join the exclusive WhatsApp group for daily motivation and expert tips.</p>
                  <button className="btn btn-primary" style={{ width: '100%', background: '#25D366', color: 'white', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)' }}>Join WhatsApp Group</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ display: 'inline-flex', padding: '2rem', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <Layout size={60} color="var(--color-primary)" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Your Learning Dashboard</h2>
              <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 2rem' }}>Select a program from the menu to start your transformation journey today.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => router.push('/programs')}
                style={{ padding: '0.75rem 2rem' }}
              >
                Browse All Programs
              </button>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          .main-content { margin-left: 0 !important; }
          .top-header { padding: 0 1rem !important; }
          .content-container { padding: 0.5rem !important; }
        }
        @media (min-width: 769px) {
          .video-info-header { flex-direction: row !important; justify-content: space-between !important; align-items: center !important; }
          .video-info-header button { width: auto !important; }
        }
        .mobile-only { display: none; }
      `}</style>
    </div>
  );
}

