'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  BookOpen,
  Video,
  UserPlus,
  Layout,
  Trash2,
  LogOut,
  Download,
  CalendarCheck,
  ShieldCheck,
  Search,
  Bell,
  Sun,
  Moon,
  TrendingUp,
  Dumbbell,
  PlusCircle,
  Settings as SettingsIcon,
  Activity,
  BarChart2,
  Mail,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Tab states
  const [activeTab, setActiveTab] = useState('users');
  
  // Data states
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [links, setLinks] = useState({ webinar_link: '', whatsapp_link: '', webinar_date: '', webinar_time: '' });
  const [registrations, setRegistrations] = useState([]);

  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user', tier: 'Performance' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '', includes: '', image: '', recommended: false });
  const [newVideo, setNewVideo] = useState({ title: '', youtube_id: '', course_id: '', order_index: 0 });

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);

  // Assignment state
  const [assignData, setAssignData] = useState({ userId: '', courseId: '' });

  // Search filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Persist theme choice
  useEffect(() => {
    const savedTheme = localStorage.getItem('adm-theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
    
    // Auth validation
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const currentUser = JSON.parse(userStr);
    if (currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }

    // Initial data fetch
    fetchUsers();
    fetchCourses();
  }, [router]);

  // Handle data fetching per tab
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'courses') {
      fetchCourses();
      fetchAssignments();
    } else if (activeTab === 'videos') {
      fetchVideos();
      fetchCourses();
    } else if (activeTab === 'assignments') {
      fetchAssignments();
      fetchUsers();
      fetchCourses();
    } else if (activeTab === 'links') {
      fetchLinks();
    } else if (activeTab === 'webinar') {
      fetchRegistrations();
    }
  }, [activeTab]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('adm-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setLinks({
            webinar_link: data.settings.webinar_link || '',
            whatsapp_link: data.settings.whatsapp_link || '',
            webinar_date: data.settings.webinar_date || '',
            webinar_time: data.settings.webinar_time || ''
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLinks = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links)
      });
      if (res.ok) {
        alert('Settings updated successfully');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update settings');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/videos');
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/admin/assignments');
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        const firstUser = data.find(u => u.role !== 'admin');
        if (firstUser) {
          setAssignData(prev => ({ ...prev, userId: prev.userId || firstUser.id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/admin/webinar-registrations');
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        alert('User registered successfully');
        setNewUser({ name: '', email: '', password: '', role: 'user', tier: 'Performance' });
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.message || 'Error registering user');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/admin/courses/${editingCourseId}` : '/api/admin/courses';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        alert(isEditing ? 'Course updated successfully' : 'Course added successfully');
        handleCancelEdit();
        fetchCourses();
      } else {
        const data = await res.json();
        alert(data.message || 'Error processing course');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const url = editingVideoId ? `/api/admin/videos/${editingVideoId}` : '/api/admin/videos';
      const method = editingVideoId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newVideo, module_id: null })
      });
      if (res.ok) {
        alert(editingVideoId ? 'Video updated successfully' : 'Video added successfully');
        setNewVideo({ title: '', youtube_id: '', course_id: '', order_index: 0 });
        setEditingVideoId(null);
        fetchVideos();
      } else {
        const data = await res.json();
        alert(data.error || data.message || 'Error processing video');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleEditVideo = (v) => {
    setNewVideo({ title: v.title, youtube_id: v.youtube_id, course_id: v.course_id, order_index: v.order_index });
    setEditingVideoId(v.id);
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
      if (res.ok) fetchVideos();
    } catch (err) {
      alert('Network error');
    }
  };

  const handleEditCourse = (course) => {
    setNewCourse({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      includes: course.includes || '',
      image: course.image || '',
      recommended: !!course.recommended
    });
    setIsEditing(true);
    setEditingCourseId(course.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCourseId(null);
    setNewCourse({ title: '', description: '', duration: '', includes: '', image: '', recommended: false });
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/assign-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignData)
      });
      if (res.ok) {
        alert('Course assigned successfully');
        setAssignData(prev => ({ ...prev, courseId: '' }));
        fetchAssignments();
      } else {
        const data = await res.json();
        alert(data.message || 'Error assigning course');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleRemoveAssignment = async (userId, courseId) => {
    if (!window.confirm('Remove this course assignment?')) return;
    try {
      const res = await fetch(`/api/admin/assignments/${userId}/${courseId}`, { method: 'DELETE' });
      if (res.ok) fetchAssignments();
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course? All modules/videos assignments could be affected.')) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
      if (res.ok) fetchCourses();
    } catch (err) {
      alert('Network error');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await fetch('/api/admin/user-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Filter users based on search
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`adm-root ${isDark ? 'adm-dark' : 'adm-light'}`}
      style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--adm-bg)', color: 'var(--adm-on-surface)', fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar" style={{ width: 230 }}>
        {/* Sidebar Header */}
        <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--adm-border)', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <div style={{ padding: '6px', background: 'var(--adm-primary)', borderRadius: '8px', display: 'flex' }}>
            <Dumbbell size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--adm-sb-text)', lineHeight: 1.1 }}>
              BURN IT OUT
            </div>
            <div style={{ fontSize: '.6rem', color: 'var(--adm-sb-muted)', fontWeight: 600 }}>Performance Intelligence</div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div style={{ flex: 1, padding: '1rem .75rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <button className="adm-nav-item active">
            <Layout size={16} />
            <span>Dashboard</span>
          </button>
          <button className="adm-nav-item" onClick={() => setActiveTab('courses')}>
            <Dumbbell size={16} />
            <span>Workouts</span>
          </button>
          <button className="adm-nav-item" onClick={() => setActiveTab('users')}>
            <Users size={16} />
            <span>Students</span>
          </button>
          <button className="adm-nav-item" onClick={() => setActiveTab('webinar')}>
            <BarChart2 size={16} />
            <span>Analytics</span>
          </button>
          <button className="adm-nav-item" onClick={() => setActiveTab('links')}>
            <SettingsIcon size={16} />
            <span>Settings</span>
          </button>
        </div>

        {/* Sidebar Footer User Info */}
        <div style={{ padding: '.75rem 1rem', borderTop: '1px solid var(--adm-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--adm-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '.75rem', fontWeight: 800, color: '#fff' }}>A</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, color: 'var(--adm-sb-text)', fontSize: '.8rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Burn IT Admin</p>
              <p style={{ fontSize: '.58rem', color: 'var(--adm-sb-muted)', textTransform: 'uppercase', letterSpacing: '.05em', margin: '1px 0 0' }}>Management Portal</p>
            </div>
          </div>
          <div style={{ fontSize: '.6rem', color: 'var(--adm-sb-muted)', marginTop: '8px', textAlign: 'center' }}>v2.1.0</div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Topbar */}
        <header className="adm-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <ShieldCheck size={18} color="var(--adm-primary)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--adm-primary-tx)', letterSpacing: '0.02em', margin: 0 }}>
              ADMIN CONSOLE
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ fontSize: '.78rem', color: 'var(--adm-on-muted)', fontWeight: 500 }} className="adm-hide-mobile">
              📅 {formattedDate}
            </span>
            <button onClick={toggleTheme} className="adm-btn-icon" title={isDark ? 'Light Mode' : 'Dark Mode'}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="adm-btn-icon"><Bell size={16} /></button>
            <button onClick={handleLogout} className="adm-btn adm-btn-outline" style={{ padding: '.45rem .85rem', height: 36 }}>
              <LogOut size={14} /> <span className="adm-hide-mobile">Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Navigation Tabs */}
        <div className="adm-tab-bar">
          <button className={`adm-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
          <button className={`adm-tab ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>Courses</button>
          <button className={`adm-tab ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>Videos</button>
          <button className={`adm-tab ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>Assignments</button>
          <button className={`adm-tab ${activeTab === 'webinar' ? 'active' : ''}`} onClick={() => setActiveTab('webinar')}>Webinars</button>
          <button className={`adm-tab ${activeTab === 'links' ? 'active' : ''}`} onClick={() => setActiveTab('links')}>Settings</button>
        </div>

        {/* Tab Content Body */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            {/* ── TAB 1: USERS ── */}
            {activeTab === 'users' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, textTransform: 'none' }}>User Management</h2>
                    <p style={{ color: 'var(--adm-on-muted)', fontSize: '.85rem', margin: '4px 0 0' }}>Oversee system roles, permissions, and active athletic profiles.</p>
                  </div>
                </div>

                <div className="adm-two-col" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                  
                  {/* Left Column Forms */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Quick Registration Form */}
                    <div className="adm-card" style={{ padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 .25rem', textTransform: 'none' }}>Quick Registration</h3>
                      <p style={{ color: 'var(--adm-on-muted)', fontSize: '.75rem', margin: '0 0 1.25rem' }}>Provision new admin or student access.</p>
                      
                      <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
                        <div>
                          <label className="adm-label">Full Name</label>
                          <input type="text" placeholder="e.g. Marcus Aurelius" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="adm-input" required />
                        </div>
                        <div>
                          <label className="adm-label">Email Address</label>
                          <input type="email" placeholder="m.aurelius@burnitout.com" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="adm-input" required />
                        </div>
                        <div>
                          <label className="adm-label">Password</label>
                          <input type="password" placeholder="••••••••" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="adm-input" required />
                        </div>
                        
                        <div>
                          <label className="adm-label">Role</label>
                          <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="adm-input" style={{ cursor: 'pointer' }}>
                            <option value="user">Student</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        <button type="submit" className="adm-btn adm-btn-primary" style={{ width: '100%', marginTop: '.5rem', background: 'var(--adm-primary-lt)', color: 'var(--adm-primary-tx)' }}>
                          Generate Credentials
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column List Table */}
                  <div className="adm-card" style={{ padding: '1.5rem 0 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem 1.25rem', borderBottom: '1px solid var(--adm-border)', flexWrap: 'wrap', gap: '.75rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, textTransform: 'none' }}>All Users</h3>
                      <div style={{ display: 'flex', gap: '.5rem' }}>
                        <div className="adm-search-wrap">
                          <Search size={14} />
                          <input type="text" placeholder="Search athletes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="adm-search-input" />
                        </div>
                        <button className="adm-btn-icon" style={{ borderRadius: 10 }}><SlidersHorizontal size={14} /></button>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table className="adm-table">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-on-muted)' }}>No athletes found.</td>
                            </tr>
                          ) : (
                            filteredUsers.map(u => (
                              <tr key={u.id}>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--adm-primary-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--adm-primary-tx)', fontSize: '.8rem' }}>
                                      {getInitials(u.name)}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 700, color: 'var(--adm-on-surface)' }}>{u.name}</div>
                                      <div style={{ fontSize: '.75rem', color: 'var(--adm-on-muted)' }}>{u.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className={`adm-badge adm-badge-${u.role || 'user'}`}>
                                    {u.role === 'admin' ? 'Admin' : 'Student'}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.8rem', fontWeight: 600 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.is_active ? '#10b981' : '#ba1a1a' }} />
                                    <span style={{ color: u.is_active ? '#10b981' : '#ba1a1a' }}>
                                      {u.is_active ? 'Active' : 'Suspended'}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  {u.role !== 'admin' && (
                                    <button onClick={() => toggleUserStatus(u.id, u.is_active)} className="adm-btn adm-btn-outline" style={{ padding: '.35rem .75rem', fontSize: '.75rem' }}>
                                      Toggle Status
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination info bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderTop: '1px solid var(--adm-border)', flexWrap: 'wrap', gap: '.75rem' }}>
                      <span style={{ fontSize: '.78rem', color: 'var(--adm-on-muted)' }}>
                        Showing 1-{filteredUsers.length} of {filteredUsers.length} users
                      </span>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        <button className="adm-btn-icon" style={{ width: 28, height: 28 }}><ChevronLeft size={14} /></button>
                        <button className="adm-btn adm-btn-primary" style={{ width: 28, height: 28, padding: 0, fontSize: '.75rem' }}>1</button>
                        <button className="adm-btn-icon" style={{ width: 28, height: 28 }}><ChevronRight size={14} /></button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ── TAB 2: COURSES ── */}
            {activeTab === 'courses' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, textTransform: 'none' }}>Course & Workout Programs</h2>
                  <p style={{ color: 'var(--adm-on-muted)', fontSize: '.85rem', margin: '4px 0 0' }}>Add new training structures or edit existing programs.</p>
                </div>

                <div className="adm-two-col" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                  
                  {/* Left Column Add/Edit form */}
                  <div className="adm-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 .5rem', textTransform: 'none' }}>
                      {isEditing ? 'Modify Workout Program' : 'Create Workout Program'}
                    </h3>
                    
                    <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
                      <div>
                        <label className="adm-label">Course Title</label>
                        <input type="text" placeholder="e.g. Metabolic Conditioning" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} className="adm-input" required />
                      </div>
                      <div>
                        <label className="adm-label">Description</label>
                        <textarea placeholder="Outline training methodologies..." value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} className="adm-input" style={{ minHeight: 80, resize: 'vertical' }} />
                      </div>
                      <div>
                        <label className="adm-label">Duration</label>
                        <input type="text" placeholder="e.g. 6 Weeks" value={newCourse.duration} onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })} className="adm-input" />
                      </div>
                      <div style={{ display: 'flex', gap: '.5rem', marginTop: '.25rem' }}>
                        <button type="submit" className="adm-btn adm-btn-primary" style={{ flex: 1 }}>
                          {isEditing ? 'Save Changes' : 'Create Program'}
                        </button>
                        {isEditing && (
                          <button type="button" onClick={handleCancelEdit} className="adm-btn adm-btn-outline">
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right Column List */}
                  <div className="adm-card" style={{ padding: '1.5rem 0 0' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 1.5rem 1.25rem', textTransform: 'none' }}>Active Programs</h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table className="adm-table">
                        <thead>
                          <tr>
                            <th>Program Title</th>
                            <th>Duration</th>
                            <th>Description</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.length === 0 ? (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-on-muted)' }}>No training programs defined.</td>
                            </tr>
                          ) : (
                            courses.map(c => (
                              <tr key={c.id}>
                                <td><div style={{ fontWeight: 700, color: 'var(--adm-on-surface)' }}>{c.title}</div></td>
                                <td><span className="adm-badge adm-badge-user">{c.duration || 'N/A'}</span></td>
                                <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--adm-on-muted)' }}>{c.description || '-'}</td>
                                <td style={{ textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', gap: '.35rem' }}>
                                    <button onClick={() => handleEditCourse(c)} className="adm-btn adm-btn-outline" style={{ padding: '.35rem .75rem', fontSize: '.75rem' }}>Edit</button>
                                    <button onClick={() => handleDeleteCourse(c.id)} className="adm-btn adm-btn-danger" style={{ padding: '.35rem .75rem', fontSize: '.75rem' }}>Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ── TAB 3: VIDEOS ── */}
            {activeTab === 'videos' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, textTransform: 'none' }}>Video Tutorial Uploads</h2>
                  <p style={{ color: 'var(--adm-on-muted)', fontSize: '.85rem', margin: '4px 0 0' }}>Assign YouTube video content links to specific training programs.</p>
                </div>

                <div className="adm-two-col" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                  
                  {/* Add Video Form */}
                  <div className="adm-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 .75rem', textTransform: 'none' }}>
                      {editingVideoId ? 'Modify Video Link' : 'Register Video Lesson'}
                    </h3>
                    
                    <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
                      <div>
                        <label className="adm-label">Video Lesson Title</label>
                        <input type="text" placeholder="e.g. 01. Biomechanical Efficiency" value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} className="adm-input" required />
                      </div>
                      <div>
                        <label className="adm-label">YouTube Video ID</label>
                        <input type="text" placeholder="e.g. dQw4w9WgXcQ" value={newVideo.youtube_id} onChange={e => setNewVideo({ ...newVideo, youtube_id: e.target.value })} className="adm-input" required />
                      </div>
                      <div>
                        <label className="adm-label">Parent Workout Program</label>
                        <select value={newVideo.course_id} onChange={e => setNewVideo({ ...newVideo, course_id: e.target.value })} className="adm-input" required style={{ cursor: 'pointer' }}>
                          <option value="">Choose program...</option>
                          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="adm-label">Lesson Order Sequence</label>
                        <input type="number" placeholder="0" value={newVideo.order_index} onChange={e => setNewVideo({ ...newVideo, order_index: parseInt(e.target.value) || 0 })} className="adm-input" />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '.5rem', marginTop: '.25rem' }}>
                        <button type="submit" className="adm-btn adm-btn-primary" style={{ flex: 1 }}>
                          {editingVideoId ? 'Save Lesson' : 'Upload Lesson'}
                        </button>
                        {editingVideoId && (
                          <button type="button" onClick={() => setEditingVideoId(null)} className="adm-btn adm-btn-outline">
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Video List */}
                  <div className="adm-card" style={{ padding: '1.5rem 0 0' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 1.5rem 1.25rem', textTransform: 'none' }}>Registered Videos</h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table className="adm-table">
                        <thead>
                          <tr>
                            <th>Lesson Title</th>
                            <th>YouTube ID</th>
                            <th>Parent Course</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {videos.length === 0 ? (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-on-muted)' }}>No instructional videos uploaded.</td>
                            </tr>
                          ) : (
                            videos.map(v => (
                              <tr key={v.id}>
                                <td><div style={{ fontWeight: 700, color: 'var(--adm-on-surface)' }}>{v.title}</div></td>
                                <td><code style={{ fontSize: '.75rem', padding: '3px 8px', background: 'var(--adm-surf-low)', borderRadius: 6 }}>{v.youtube_id}</code></td>
                                <td><span className="adm-badge adm-badge-admin">{v.course_title || 'N/A'}</span></td>
                                <td style={{ textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', gap: '.35rem' }}>
                                    <button onClick={() => handleEditVideo(v)} className="adm-btn adm-btn-outline" style={{ padding: '.35rem .75rem', fontSize: '.75rem' }}>Edit</button>
                                    <button onClick={() => handleDeleteVideo(v.id)} className="adm-btn adm-btn-danger" style={{ padding: '.35rem .75rem', fontSize: '.75rem' }}>Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ── TAB 4: ASSIGNMENTS ── */}
            {activeTab === 'assignments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, textTransform: 'none' }}>Course Access Assignments</h2>
                  <p style={{ color: 'var(--adm-on-muted)', fontSize: '.85rem', margin: '4px 0 0' }}>Provision training program dashboard visibility to specific student profiles.</p>
                </div>

                <div className="adm-two-col" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                  
                  {/* Access Assignment Form */}
                  <div className="adm-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.25rem', textTransform: 'none' }}>Assign Course Access</h3>
                    
                    <form onSubmit={handleAssignCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label className="adm-label">Target Student</label>
                        <select value={assignData.userId} onChange={e => setAssignData({ ...assignData, userId: e.target.value })} className="adm-input" required style={{ cursor: 'pointer' }}>
                          <option value="">Choose student...</option>
                          {users.filter(u => u.role !== 'admin').map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="adm-label">Workout Program</label>
                        <select value={assignData.courseId} onChange={e => setAssignData({ ...assignData, courseId: e.target.value })} className="adm-input" required style={{ cursor: 'pointer' }}>
                          <option value="">Choose program...</option>
                          {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>

                      <button type="submit" className="adm-btn adm-btn-primary" style={{ width: '100%', marginTop: '.5rem' }}>
                        Grant Course Access
                      </button>
                    </form>
                  </div>

                  {/* Current Active Access list */}
                  <div className="adm-card" style={{ padding: '1.5rem 0 0' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 1.5rem 1.25rem', textTransform: 'none' }}>Current Program Access</h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table className="adm-table">
                        <thead>
                          <tr>
                            <th>Student Profile</th>
                            <th>Assigned Course Program</th>
                            <th>Access Date</th>
                            <th style={{ textAlign: 'right' }}>Revoke</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignments.length === 0 ? (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-on-muted)' }}>No student course assignments currently active.</td>
                            </tr>
                          ) : (
                            assignments.map(a => (
                              <tr key={`${a.userId}-${a.courseId}`}>
                                <td>
                                  <div>
                                    <div style={{ fontWeight: 700, color: 'var(--adm-on-surface)' }}>{a.userName}</div>
                                    <div style={{ fontSize: '.75rem', color: 'var(--adm-on-muted)' }}>{a.userEmail}</div>
                                  </div>
                                </td>
                                <td>
                                  <span className="adm-badge adm-badge-coach">{a.courseTitle}</span>
                                </td>
                                <td>
                                  <span style={{ fontSize: '.8rem', color: 'var(--adm-on-muted)', fontWeight: 500 }}>
                                    {new Date(a.assignedAt).toLocaleDateString()}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <button onClick={() => handleRemoveAssignment(a.userId, a.courseId)} className="adm-btn adm-btn-danger" style={{ padding: '.35rem .5rem' }} title="Revoke access">
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ── TAB 5: WEBINAR REGISTRATIONS ── */}
            {activeTab === 'webinar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, textTransform: 'none' }}>Live Webinar Leads</h2>
                    <p style={{ color: 'var(--adm-on-muted)', fontSize: '.85rem', margin: '4px 0 0' }}>Review athlete leads generated from live landing page webinar registrations.</p>
                  </div>
                </div>

                <div className="adm-card" style={{ padding: '1.5rem 0 0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 1.5rem 1.25rem', textTransform: 'none' }}>Registered Leads</h3>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table className="adm-table">
                      <thead>
                        <tr style={{ background: 'var(--adm-surf-low)' }}>
                          <th style={{ padding: '1rem' }}>Date & Time</th>
                          <th style={{ padding: '1rem' }}>Full Name</th>
                          <th style={{ padding: '1rem' }}>Contact Info</th>
                          <th style={{ padding: '1rem' }}>Demographics</th>
                          <th style={{ padding: '1rem' }}>Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-on-muted)' }}>No leads registered yet.</td>
                          </tr>
                        ) : (
                          registrations.map(r => (
                            <tr key={r.id}>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: 700 }}>{new Date(r.created_at).toLocaleDateString()}</div>
                                <div style={{ fontSize: '.7rem', color: 'var(--adm-on-muted)' }}>{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              </td>
                              <td style={{ padding: '1rem', fontWeight: 700 }}>{r.name}</td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: 600 }}>{r.email}</div>
                                <div style={{ fontSize: '.75rem', color: 'var(--adm-on-muted)' }}>📞 {r.phone || 'N/A'}</div>
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: 600 }}>{r.age || 'N/A'} yrs</div>
                                <div style={{ fontSize: '.75rem', color: 'var(--adm-on-muted)' }}>📍 {r.region || 'N/A'}</div>
                              </td>
                              <td style={{ padding: '1rem', maxWidth: '250px', fontSize: '.8rem', color: 'var(--adm-on-muted)', lineHeight: 1.4 }}>
                                {r.message || '-'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 6: SETTINGS ── */}
            {activeTab === 'links' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, textTransform: 'none' }}>Site Settings</h2>
                  <p style={{ color: 'var(--adm-on-muted)', fontSize: '.85rem', margin: '4px 0 0' }}>Manage global landing page webinar URLs, dates, WhatsApp support links.</p>
                </div>

                <div className="adm-card" style={{ padding: '2rem', maxWidth: 650 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.25rem', textTransform: 'none' }}>Webinar & Social Configurations</h3>
                  
                  <form onSubmit={handleUpdateLinks} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label className="adm-label">Live Webinar Stream URL</label>
                      <input type="url" placeholder="https://youtube.com/live/..." value={links.webinar_link} onChange={e => setLinks({ ...links, webinar_link: e.target.value })} className="adm-input" />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="adm-label">Scheduled Date</label>
                        <input type="date" value={links.webinar_date} onChange={e => setLinks({ ...links, webinar_date: e.target.value })} className="adm-input" />
                      </div>
                      <div>
                        <label className="adm-label">Webinar Clock Time</label>
                        <input type="text" placeholder="e.g. 7:00 PM IST" value={links.webinar_time} onChange={e => setLinks({ ...links, webinar_time: e.target.value })} className="adm-input" />
                      </div>
                    </div>

                    <div>
                      <label className="adm-label">Exclusive WhatsApp Support Invite Link</label>
                      <input type="url" placeholder="https://chat.whatsapp.com/..." value={links.whatsapp_link} onChange={e => setLinks({ ...links, whatsapp_link: e.target.value })} className="adm-input" />
                    </div>

                    <button type="submit" className="adm-btn adm-btn-primary" style={{ alignSelf: 'flex-start', marginTop: '.5rem', padding: '.75rem 2rem' }}>
                      Update Settings System
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* Footer */}
        <footer style={{ padding: '1rem 2rem', borderTop: '1px solid var(--adm-border)', background: 'var(--adm-surface)', textAlign: 'center', fontSize: '.78rem', color: 'var(--adm-on-muted)' }}>
          © {new Date().getFullYear()} BURN IT OUT. All systems nominal. High performance achieved through scientific precision.
        </footer>
      </div>

    </div>
  );
}
