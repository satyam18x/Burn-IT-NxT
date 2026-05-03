'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, BookOpen, Activity, Users, ArrowRight, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
    // fetchMyCourses is called here directly — no dependency on `user` state
    fetchMyCourses();
  }, [router]);

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

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-dark)', color: 'white', padding: '1rem 0' }}>
        <div className="container dashboard-header-flex">
          <h2 style={{ fontSize: '1.5rem', color: 'white' }}>Welcome back, {user.name?.split(' ')[0]}!</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {activeCourse ? activeCourse.title : 'My Dashboard'}
            </span>
            <button
              className="btn"
              style={{ background: 'transparent', border: 'none', color: 'white' }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        {/* My Assigned Courses — shown prominently at the top */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <BookOpen color="var(--color-primary)" size={22} />
            My Assigned Courses
          </h3>

          {loadingCourses ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', opacity: 0.6 }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Loading your courses...</span>
            </div>
          ) : courses.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem',
              background: 'var(--color-accent)',
              borderRadius: '12px',
              color: 'var(--color-text)'
            }}>
              <BookOpen size={40} style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>No Courses Assigned Yet</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1.5rem' }}>
                Your coach hasn't assigned a program to you yet. Check back soon or browse all programs.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => router.push('/programs')}
              >
                Browse Programs
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {courses.map(c => (
                <div
                  key={c.id}
                  onClick={() => router.push('/programs')}
                  style={{
                    padding: '1.5rem',
                    background: 'white',
                    border: '2px solid var(--color-primary)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '10px',
                      background: 'var(--color-accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <PlayCircle color="var(--color-primary)" size={20} />
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', lineHeight: '1.3' }}>{c.title}</h4>
                  </div>
                  {c.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', opacity: 0.8, lineHeight: '1.5' }}>
                      {c.description.length > 80 ? c.description.slice(0, 80) + '...' : c.description}
                    </p>
                  )}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.85rem', marginTop: 'auto'
                  }}>
                    Access Program <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-grid">
          {/* Left — Video player + module list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              {activeCourse ? (
                <>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <PlayCircle color="var(--color-primary)" />
                    {activeVideo ? activeVideo.title : 'Select a video'}
                  </h3>
                  <VideoPlayer youtubeId={youtubeId} userEmail={user.email} />
                  {loadingVideo && (
                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', opacity: 0.7 }}>
                      Loading secure stream...
                    </p>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.5 }}>
                  <PlayCircle size={48} style={{ marginBottom: '1rem' }} />
                  <h3>Select a course above to start watching</h3>
                </div>
              )}
            </div>

            {activeCourse?.modules?.map((mod) => (
              <div key={mod.id} className="card" style={{ padding: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{mod.title}</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {mod.videos?.map(video => (
                    <li
                      key={video.id}
                      onClick={() => handleSelectVideo(video)}
                      style={{
                        padding: '1rem',
                        background: activeVideo?.id === video.id ? 'var(--color-accent)' : 'white',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {video.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Activity color="var(--color-primary)" size={20} /> Progress
              </h4>
              <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--color-accent)', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>2.5kg</div>
                <div>Lost so far</div>
              </div>
            </div>
            <div className="card" style={{ padding: '1.5rem', background: 'var(--color-dark)', color: 'white' }}>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>
                <Users color="var(--color-primary)" size={20} /> Community
              </h4>
              <button className="btn btn-primary" style={{ width: '100%' }}>Join Group</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

