'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, DownloadCloud, Activity, Users } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [youtubeId, setYoutubeId] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
    fetchMyCourses();
  }, [router]);

  const fetchMyCourses = async () => {
    console.log("Fetching courses for user:", user);
    try {
      const res = await fetch('/api/user/courses');
      console.log("Fetch courses response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Received courses data:", data);
        setCourses(data);
        if (data.length > 0) {
          fetchCourseDetails(data[0].id);
        }
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (err) {
      console.error("Fetch courses error:", err);
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
        console.error("Failed to fetch video access");
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
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'var(--color-dark)', color: 'white', padding: '1rem 0' }}>
        <div className="container dashboard-header-flex">
          <h2 style={{ fontSize: '1.5rem', color: 'white' }}>Welcome back, {user.name?.split(' ')[0]}!</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{activeCourse ? activeCourse.title : 'My Dashboard'}</span>
            <button className="btn" style={{ background: 'transparent', border: 'none', color: 'white' }} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="dashboard-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              {activeCourse ? (
                <>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <PlayCircle color="var(--color-primary)" /> {activeVideo ? activeVideo.title : 'Select a video'}
                  </h3>
                  <VideoPlayer 
                    youtubeId={youtubeId} 
                    userEmail={user.email} 
                  />
                  {loadingVideo && <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', opacity: 0.7 }}>Loading secure stream...</p>}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <h3>No courses assigned.</h3>
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
                        border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', cursor: 'pointer' 
                      }}
                    >
                      {video.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><DownloadCloud color="var(--color-primary)" size={20} /> My Courses</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {courses.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => fetchCourseDetails(c.id)}
                    style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      background: activeCourse?.id === c.id ? 'var(--color-accent)' : 'white', 
                      border: '1px solid rgba(0,0,0,0.1)', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: activeCourse?.id === c.id ? '700' : '400'
                    }}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><Activity color="var(--color-primary)" size={20} /> Progress</h4>

              <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--color-accent)', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>2.5kg</div>
                <div>Lost so far</div>
              </div>
            </div>
            <div className="card" style={{ padding: '1.5rem', background: 'var(--color-dark)', color: 'white' }}>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}><Users color="var(--color-primary)" size={20} /> Community</h4>
              <button className="btn btn-primary" style={{ width: '100%' }}>Join Group</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

