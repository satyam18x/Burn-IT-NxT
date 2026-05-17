'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlayCircle, CheckCircle2, LogOut, Menu, X, ChevronLeft, ChevronRight,
  Loader2, Lock, Sun, Moon, Dumbbell, Sparkles, SkipBack, SkipForward,
  Pause, Maximize, FileText, MessageSquare, Clock, Download, TrendingUp,
  Users, Activity, Layout, BarChart2, Home, User as UserIcon, ClipboardList
} from 'lucide-react';
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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('db-theme');
    if (saved === 'dark') setIsDark(true);
    const userStr = localStorage.getItem('user');
    if (!userStr) { router.push('/login'); return; }
    setUser(JSON.parse(userStr));
    fetchMyCourses();
    fetchWatchedVideos();
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, [router]);

  const toggleTheme = () => {
    setIsDark(d => { localStorage.setItem('db-theme', !d ? 'dark' : 'light'); return !d; });
  };

  const fetchWatchedVideos = async () => {
    try { const r = await fetch('/api/user/progress'); if (r.ok) setWatchedVideos(await r.json()); } catch {}
  };
  const fetchProgressStats = async (courseId) => {
    try { const r = await fetch(`/api/user/progress?courseId=${courseId}`); if (r.ok) setProgressStats(await r.json()); } catch {}
  };
  const fetchMyCourses = async () => {
    setLoadingCourses(true);
    try {
      const r = await fetch('/api/user/courses');
      if (r.ok) { const d = await r.json(); setCourses(d); if (d.length > 0) fetchCourseDetails(d[0].id); }
      else if (r.status === 401) router.push('/login');
    } catch {} finally { setLoadingCourses(false); }
  };
  const fetchCourseDetails = async (courseId) => {
    try {
      const r = await fetch(`/api/user/course/${courseId}`);
      if (r.ok) {
        const d = await r.json(); setActiveCourse(d); fetchProgressStats(courseId);
        const firstVid = d.modules?.[0]?.videos?.[0];
        if (firstVid) handleSelectVideo(firstVid);
      }
    } catch {}
  };
  const handleSelectVideo = async (video) => {
    setActiveVideo(video); setLoadingVideo(true); setYoutubeId(null);
    try { const r = await fetch(`/api/video/${video.id}`); if (r.ok) setYoutubeId((await r.json()).youtube_id); }
    catch {} finally { setLoadingVideo(false); }
  };
  const markAsWatched = async (videoId) => {
    try {
      const r = await fetch('/api/user/progress', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({videoId}) });
      if (r.ok && !watchedVideos.includes(videoId)) {
        setWatchedVideos(p => [...p, videoId]);
        if (activeCourse) fetchProgressStats(activeCourse.id);
      }
    } catch {}
  };
  const handleLogout = async () => {
    try { await fetch('/api/logout', { method:'POST' }); } catch {}
    localStorage.removeItem('user'); localStorage.removeItem('token'); router.push('/login');
  };

  const allVideos = activeCourse?.modules?.flatMap(m => m.videos || []) || [];
  const currentIndex = allVideos.findIndex(v => v.id === activeVideo?.id);
  const handleNext = () => { if (currentIndex < allVideos.length - 1) handleSelectVideo(allVideos[currentIndex + 1]); };
  const handlePrev = () => { if (currentIndex > 0) handleSelectVideo(allVideos[currentIndex - 1]); };
  const handleVideoEnded = () => { markAsWatched(activeVideo.id); handleNext(); };

  if (!user) return null;

  const initials = user.name?.charAt(0).toUpperCase() || 'U';
  const isWatched = activeVideo && watchedVideos.includes(activeVideo.id);

  return (
    <div className={`db-root ${isDark ? 'db-dark' : 'db-light'}`}
      style={{ display:'flex', minHeight:'100vh', backgroundColor:'var(--db-bg)', color:'var(--db-on-surface)', fontFamily:"'Montserrat',sans-serif", position:'relative' }}>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:1900, display:'none' }} className="db-mob-overlay" />
      )}

      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar" style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>

        {/* Logo */}
        <div style={{ padding:'1.25rem 1.25rem 1rem', borderBottom:'1px solid var(--db-sb-border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
            <div style={{ padding:'7px', background:'var(--db-primary)', borderRadius:'10px', display:'flex' }}>
              <Dumbbell size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize:'1rem', fontWeight:800, color:'var(--db-sb-text)', lineHeight:1 }}>
                <span style={{ color:'var(--db-primary)' }}>BURN</span> IT OUT
              </div>
              <div style={{ fontSize:'.6rem', color:'var(--db-sb-muted)', textTransform:'uppercase', letterSpacing:'.06em', marginTop:'2px' }}>Advanced Athlete Track</div>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="db-btn-icon" style={{ width:30, height:30, flexShrink:0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Course selector */}
        <div style={{ padding:'.75rem 1rem .25rem', flexShrink:0 }}>
          <span className="db-module-label" style={{ padding:'0 0 .3rem' }}>Active Program</span>
          <select value={activeCourse?.id || ''} onChange={e => fetchCourseDetails(e.target.value)}
            style={{ width:'100%', background:'var(--db-surface-mid)', color:'var(--db-on-surface)', border:'1px solid var(--db-border)', borderRadius:10, padding:'.55rem .75rem', fontSize:'.82rem', fontFamily:'Montserrat', outline:'none', cursor:'pointer' }}>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        {/* Curriculum */}
        <div style={{ flex:1, overflowY:'auto', padding:'.75rem 1rem' }}>
          <span className="db-module-label" style={{ color:'var(--db-primary)', padding:'0 0 .5rem' }}>Course Curriculum</span>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {allVideos.map((video, i) => {
              const watched = watchedVideos.includes(video.id);
              const active = activeVideo?.id === video.id;
              return (
                <button key={video.id} onClick={() => handleSelectVideo(video)}
                  className={`db-sidebar-item${active ? ' active' : watched ? ' watched' : ''}`}>
                  {watched
                    ? <CheckCircle2 size={15} className="db-check" />
                    : active ? <PlayCircle size={15} /> : <Lock size={14} style={{ opacity:.5 }} />}
                  <span style={{ flex:1 }}>{String(i+1).padStart(2,'0')}. {video.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User footer */}
        <div style={{ padding:'.75rem 1rem', borderTop:'1px solid var(--db-sb-border)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.6rem .75rem', background:'rgba(128,128,128,.08)', borderRadius:12 }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--db-primary)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:'.8rem', fontWeight:800, color:'#fff' }}>{initials}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontWeight:700, color:'var(--db-sb-text)', fontSize:'.82rem', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</p>
              <p style={{ fontSize:'.6rem', color:'var(--db-sb-muted)', textTransform:'uppercase', letterSpacing:'.05em', margin:'1px 0 0' }}>Student</p>
            </div>
            <button onClick={handleLogout} title="Logout" style={{ background:'none', border:'none', color:'var(--db-sb-muted)', cursor:'pointer', display:'flex', padding:4 }}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, marginLeft: isSidebarOpen ? 0 : 0 }}>

        {/* Top bar */}
        <header className="db-topbar">
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="db-btn-icon" style={{ width:36, height:36 }}>
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h2 style={{ fontSize:'1rem', fontWeight:700, color:'var(--db-on-surface)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:260 }}>
              {activeVideo ? activeVideo.title : activeCourse ? activeCourse.title : 'Dashboard'}
            </h2>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
            <div className="db-hide-mobile" style={{ display:'flex', alignItems:'center', gap:'.4rem', padding:'5px 12px', background:'var(--db-ai-bg)', border:'1px solid var(--db-ai-border)', borderRadius:999 }}>
              <Sparkles size={13} color="var(--db-primary)" />
              <span style={{ fontSize:'.7rem', fontWeight:600, color:'var(--db-primary)' }}>Performance Intelligence AI</span>
            </div>
            <button onClick={toggleTheme} className="db-btn-icon" title={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--db-primary)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 0 2px var(--db-primary), 0 0 0 4px var(--db-surface)' }}>
              <span style={{ fontSize:'.8rem', fontWeight:800, color:'#fff' }}>{initials}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex:1, overflowY:'auto', padding:'1.5rem' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            {activeCourse ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

                {/* Main grid: video col + right panel */}
                <div className="db-main-grid" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'1.5rem', alignItems:'start' }}>

                  {/* Left: video + info */}
                  <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

                    {/* Video player */}
                    <div className="db-card" style={{ background:'#000', overflow:'hidden', aspectRatio:'16/9', position:'relative', borderRadius:16 }}>
                      <VideoPlayer youtubeId={youtubeId} userEmail={user.email} onEnded={handleVideoEnded} />
                      {loadingVideo && (
                        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}>
                          <Loader2 size={36} color="#fff" style={{ animation:'spin 1s linear infinite' }} />
                        </div>
                      )}
                      {/* Video controls overlay */}
                      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'1rem 1.25rem', background:'linear-gradient(to top,rgba(0,0,0,.8),transparent)' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
                            <button onClick={handlePrev} disabled={currentIndex <= 0} style={{ background:'none', border:'none', color: currentIndex<=0 ? 'rgba(255,255,255,.3)':'#fff', cursor: currentIndex<=0 ?'not-allowed':'pointer' }}>
                              <SkipBack size={20} />
                            </button>
                            <button style={{ background:'none', border:'none', color:'#fff', cursor:'pointer' }}><Pause size={20} /></button>
                            <button onClick={handleNext} disabled={currentIndex >= allVideos.length-1} style={{ background:'none', border:'none', color: currentIndex>=allVideos.length-1 ? 'rgba(255,255,255,.3)':'#fff', cursor: currentIndex>=allVideos.length-1 ?'not-allowed':'pointer' }}>
                              <SkipForward size={20} />
                            </button>
                            <div style={{ height:3, width:140, background:'rgba(255,255,255,.25)', borderRadius:999, position:'relative' }}>
                              <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${allVideos.length > 1 ? (currentIndex/(allVideos.length-1))*100 : 0}%`, background:'var(--db-primary)', borderRadius:999 }} />
                            </div>
                            <span style={{ color:'rgba(255,255,255,.8)', fontSize:'.72rem', fontWeight:600 }}>
                              {currentIndex+1} / {allVideos.length}
                            </span>
                          </div>
                          <button style={{ background:'none', border:'none', color:'#fff', cursor:'pointer' }}><Maximize size={17} /></button>
                        </div>
                      </div>
                    </div>

                    {/* Lesson info */}
                    <div className="db-card" style={{ padding:'1.5rem' }}>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', justifyContent:'space-between', alignItems:'flex-start' }}>
                        <div style={{ flex:1, minWidth:220 }}>
                          <h3 style={{ fontSize:'1.2rem', fontWeight:800, color:'var(--db-on-surface)', margin:'0 0 .35rem', textTransform:'none', lineHeight:1.3 }}>
                            {activeVideo ? activeVideo.title : 'Select a lesson'}
                          </h3>
                          <p style={{ color:'var(--db-on-muted)', fontSize:'.88rem', margin:0, lineHeight:1.6 }}>
                            {activeVideo?.description || 'Mastering the physics of movement to maximize output while minimizing injury risk.'}
                          </p>
                        </div>
                        <button className={`db-btn ${isWatched ? 'db-btn-green' : 'db-btn-primary'}`}
                          onClick={() => activeVideo && markAsWatched(activeVideo.id)}
                          disabled={!activeVideo || isWatched}>
                          <CheckCircle2 size={17} />
                          {isWatched ? 'Completed' : 'Mark as Completed'}
                        </button>
                      </div>
                      <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', paddingTop:'1rem', marginTop:'1rem', borderTop:'1px solid var(--db-border)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'.4rem', color:'var(--db-on-muted)', fontSize:'.83rem', fontWeight:600 }}>
                          <FileText size={16} color="var(--db-primary)" /> PDF Resources (4)
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'.4rem', color:'var(--db-on-muted)', fontSize:'.83rem', fontWeight:600 }}>
                          <MessageSquare size={16} color="var(--db-primary)" /> 12 Discussions
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'.4rem', color:'var(--db-on-muted)', fontSize:'.83rem', fontWeight:600 }}>
                          <Clock size={16} color="var(--db-primary)" /> 18 Minutes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right panel */}
                  <div className="db-right-panel" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

                    {/* Progress */}
                    <div className="db-card" style={{ padding:'1.25rem' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.75rem' }}>
                        <h4 style={{ fontWeight:700, color:'var(--db-on-surface)', fontSize:'.88rem', margin:0, textTransform:'none' }}>
                          <Activity size={15} style={{ verticalAlign:'middle', marginRight:6, color:'var(--db-primary)' }} />
                          Your Course Progress
                        </h4>
                        <span style={{ background:'var(--db-primary-bg)', color:'var(--db-primary)', fontSize:'.75rem', fontWeight:800, padding:'3px 10px', borderRadius:999 }}>
                          {progressStats.percentage}%
                        </span>
                      </div>
                      <div className="db-progress-track">
                        <div className="db-progress-fill" style={{ width:`${progressStats.percentage}%` }} />
                      </div>
                      <p style={{ fontSize:'.75rem', color:'var(--db-on-muted)', marginTop:'.6rem', fontStyle:'italic' }}>
                        Next: Complete lesson {Math.min(currentIndex+2, allVideos.length)}
                      </p>
                      <p style={{ fontSize:'.78rem', color:'var(--db-on-muted)', margin:'.25rem 0 0' }}>
                        {progressStats.watched} of {progressStats.total} videos done
                      </p>
                    </div>

                    {/* Community */}
                    <div className="db-card" style={{ padding:'1.25rem', background:'var(--db-surface-low)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'1rem' }}>
                        <Users size={16} color="var(--db-green)" />
                        <h4 style={{ fontWeight:700, color:'var(--db-on-surface)', fontSize:'.82rem', margin:0, textTransform:'uppercase', letterSpacing:'.05em' }}>Athlete Community</h4>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:'.75rem', marginBottom:'1rem' }}>
                        {[{name:'Marco Polo', msg:'The squat mechanics in minute 5 really changed my perspective on lumbar stability.'},{name:'Sarah Chen', msg:'Anyone else feeling the peak contraction in the eccentric phase?'}].map(c => (
                          <div key={c.name} style={{ display:'flex', gap:'.6rem' }}>
                            <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--db-surface-high)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--db-border)' }}>
                              <span style={{ fontSize:'.7rem', fontWeight:700, color:'var(--db-on-muted)' }}>{c.name[0]}</span>
                            </div>
                            <div style={{ background:'var(--db-surface)', padding:'.6rem .75rem', borderRadius:10, border:'1px solid var(--db-border)', flex:1 }}>
                              <p style={{ fontSize:'.72rem', fontWeight:700, color:'var(--db-on-surface)', margin:'0 0 2px' }}>{c.name}</p>
                              <p style={{ fontSize:'.75rem', color:'var(--db-on-muted)', margin:0, lineHeight:1.4 }}>{c.msg}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="db-btn" style={{ width:'100%', background:'#25D366', color:'#fff', gap:'.5rem' }}
                        onClick={() => window.open('https://wa.me/', '_blank')}>
                        <MessageSquare size={16} /> JOIN WHATSAPP GROUP
                      </button>
                    </div>

                    {/* Support */}
                    <div style={{ background:'linear-gradient(135deg,var(--db-primary),#e04e00)', padding:'1.25rem', borderRadius:16 }}>
                      <h4 style={{ fontWeight:700, color:'#fff', fontSize:'.88rem', margin:'0 0 .35rem', textTransform:'none' }}>Stuck on a concept?</h4>
                      <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.85)', margin:'0 0 .85rem', lineHeight:1.5 }}>Our performance coaches are available 24/7 for technical analysis.</p>
                      <button className="db-btn" style={{ width:'100%', background:'#fff', color:'var(--db-primary)' }}>Request Coaching Call</button>
                    </div>
                  </div>
                </div>

                {/* Bento grid */}
                <div className="db-bento">
                  {[
                    { icon:<Download size={22} color="var(--db-primary)" />, bg:'var(--db-primary-bg)', title:'Study Guides', desc:'Download the biomechanics checklist for your next training session.' },
                    { icon:<ClipboardList size={22} color="var(--db-on-muted)" />, bg:'var(--db-surface-mid)', title:'Knowledge Quiz', desc:'Unlock the next module by completing the foundations assessment.', accent:true },
                    { icon:<TrendingUp size={22} color="var(--db-green)" />, bg:'rgba(16,185,129,.15)', title:'Live Stats', desc:'You are in the top 5% of students for course engagement this week.' },
                  ].map(b => (
                    <div key={b.title} className="db-card" style={{ padding:'1.5rem', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'.75rem', borderBottom: b.accent ? '3px solid var(--db-primary)' : undefined }}>
                      <div style={{ width:48, height:48, borderRadius:'50%', background:b.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>{b.icon}</div>
                      <h5 style={{ fontWeight:700, color:'var(--db-on-surface)', fontSize:'.88rem', margin:0, textTransform:'none' }}>{b.title}</h5>
                      <p style={{ fontSize:'.78rem', color:'var(--db-on-muted)', margin:0, lineHeight:1.5 }}>{b.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              /* Empty state */
              <div style={{ textAlign:'center', padding:'5rem 0' }}>
                <div style={{ display:'inline-flex', padding:'2rem', background:'var(--db-surface)', borderRadius:'50%', boxShadow:'var(--db-shadow)', marginBottom:'1.5rem' }}>
                  <Layout size={52} color="var(--db-primary)" />
                </div>
                <h2 style={{ fontSize:'1.8rem', fontWeight:800, color:'var(--db-on-surface)', marginBottom:'1rem', textTransform:'none' }}>Your Learning Dashboard</h2>
                <p style={{ color:'var(--db-on-muted)', maxWidth:480, margin:'0 auto 2rem', lineHeight:1.6 }}>Select a program from the sidebar to start your transformation journey today.</p>
                <button className="db-btn db-btn-primary" onClick={() => router.push('/programs')} style={{ padding:'.8rem 2rem' }}>Browse All Programs</button>
              </div>
            )}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav style={{ display:'none', position:'fixed', bottom:0, left:0, right:0, background:'var(--db-header-bg)', borderTop:'1px solid var(--db-border)', padding:'.5rem 1rem', zIndex:50, justifyContent:'space-around', alignItems:'center', boxShadow:'0 -2px 10px rgba(0,0,0,.08)' }} className="db-mobile-nav">
          {[{icon:<Home size={22}/>,label:'Home'},{icon:<ClipboardList size={22}/>,label:'Plans'},{icon:<BarChart2 size={22}/>,label:'Progress'},{icon:<UserIcon size={22}/>,label:'Profile'}].map((n,i) => (
            <button key={n.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, background: i===0 ? 'var(--db-primary-bg)' : 'none', border:'none', cursor:'pointer', padding:'6px 14px', borderRadius:20, color: i===0 ? 'var(--db-primary)' : 'var(--db-on-muted)' }}>
              {n.icon}
              <span style={{ fontSize:'.6rem', fontWeight: i===0 ? 700 : 500 }}>{n.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <style>{`
        @media(max-width:768px){
          .db-mobile-nav { display:flex !important; }
          main { padding-bottom:5rem !important; }
          .db-mob-overlay { display:block !important; }
        }
      `}</style>
    </div>
  );
}
