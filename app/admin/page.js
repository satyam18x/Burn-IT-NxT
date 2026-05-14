'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  BookOpen,
  Video,
  Link as LinkIcon,
  PlusCircle,
  UserPlus,
  Layout,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Activity,
  LogOut,
  Download,
  CalendarCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  MessageSquare,
  User as UserIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [videos, setVideos] = useState([]);
  const [links, setLinks] = useState({ webinar_link: '', whatsapp_link: '', webinar_date: '', webinar_time: '' });

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '', includes: '', image: '', recommended: false });
  const [newVideo, setNewVideo] = useState({ title: '', youtube_id: '', course_id: '', order_index: 0 });

  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);

  const [assignData, setAssignData] = useState({ userId: '', courseId: '' });
  const [assignments, setAssignments] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      router.push('/login');
      return;
    }

    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'courses') {
      fetchCourses();
      fetchAssignments();
      fetchUsers();
    } else if (activeTab === 'videos') {
      fetchVideos();
      fetchCourses();
    } else if (activeTab === 'links') {
      fetchLinks();
    } else if (activeTab === 'webinar') {
      fetchRegistrations();
    }
  }, [activeTab, router]);

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
        alert('Links updated successfully');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update links');
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
        const adminUser = data.find(u => u.role === 'admin');
        if (adminUser) {
          setAssignData(prev => ({
            ...prev,
            userId: prev.userId || adminUser.id
          }));
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
        alert('User added successfully');
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.message || 'Error adding user');
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
    if (!window.confirm('Delete video?')) return;
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setAssignData({ userId: '', courseId: '' });
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
    if (!window.confirm('Remove assignment?')) return;
    try {
      const res = await fetch(`/api/admin/assignments/${userId}/${courseId}`, { method: 'DELETE' });
      if (res.ok) fetchAssignments();
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete course?')) return;
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
      console.error('Logout API failed:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      <style>{`
        .admin-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .admin-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
        }
        .admin-input {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
          background: #fcfcfc;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          width: 100%;
          color: #1e293b;
        }
        .admin-input:focus {
          outline: none;
          border-color: #ff5e00;
          background: white;
          box-shadow: 0 0 0 4px rgba(255, 94, 0, 0.1);
        }
        .admin-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          flex-grow: 1;
        }
        .admin-btn-primary {
          background: #0f172a;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .admin-btn-primary:hover {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }
        .admin-btn-outline {
          background: white;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .admin-btn-outline:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
        }
        @media (max-width: 868px) {
          .admin-tabs-container {
            flex-direction: column !important;
            gap: 4px !important;
          }
          .admin-tab-btn {
            width: 100%;
            justify-content: flex-start;
          }
          .admin-grid-responsive {
            grid-template-columns: 1fr !important;
          }
          .admin-header-content {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1.5rem;
          }
          .container {
            padding: 0 1rem;
          }
          .webinar-mobile-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .webinar-download-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .webinar-table td, .webinar-table th {
            padding: 0.6rem 0.5rem !important;
            font-size: 0.75rem !important;
          }
          .webinar-table th {
            font-size: 0.7rem !important;
            white-space: nowrap;
          }
          .webinar-row {
            background: white !important;
          }
        }
        .webinar-row:hover {
          background-color: #f8fafc;
          cursor: pointer;
        }
      `}</style>

      <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '1.5rem 0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div className="container admin-header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'var(--color-primary)', padding: '10px', borderRadius: '12px' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', color: 'white', textTransform: 'none', letterSpacing: '-0.02em', margin: 0, fontWeight: '800' }}>Admin Console</h2>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: '2px 0 0' }}>Burn IT Out Fitness Management</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="container section-padding">
        <div className="admin-tabs-container" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', background: 'white', padding: '10px', borderRadius: '16px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <button className="admin-tab-btn" style={{ background: activeTab === 'users' ? '#0f172a' : 'transparent', color: activeTab === 'users' ? 'white' : '#64748b', border: 'none' }} onClick={() => setActiveTab('users')}>
            <Users size={18} /> Users
          </button>
          <button className="admin-tab-btn" style={{ background: activeTab === 'courses' ? '#0f172a' : 'transparent', color: activeTab === 'courses' ? 'white' : '#64748b', border: 'none' }} onClick={() => setActiveTab('courses')}>
            <BookOpen size={18} /> Courses
          </button>
          <button className="admin-tab-btn" style={{ background: activeTab === 'videos' ? '#0f172a' : 'transparent', color: activeTab === 'videos' ? 'white' : '#64748b', border: 'none' }} onClick={() => setActiveTab('videos')}>
            <Video size={18} /> Videos
          </button>
          <button className="admin-tab-btn" style={{ background: activeTab === 'links' ? '#0f172a' : 'transparent', color: activeTab === 'links' ? 'white' : '#64748b', border: 'none' }} onClick={() => setActiveTab('links')}>
            <Layout size={18} /> Settings
          </button>
          <button className="admin-tab-btn" style={{ background: activeTab === 'webinar' ? '#0f172a' : 'transparent', color: activeTab === 'webinar' ? 'white' : '#64748b', border: 'none' }} onClick={() => setActiveTab('webinar')}>
            <CalendarCheck size={18} /> Webinars
          </button>
        </div>

        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="admin-card">
              <h3 style={{ marginBottom: '1.5rem' }}>Add New User</h3>
              <form onSubmit={handleAddUser} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="admin-input" required />
                <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="admin-input" required />
                <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="admin-input" required />
                <button type="submit" className="admin-btn-primary">Create User</button>
              </form>
            </div>
            <div className="admin-card">
              <h3 style={{ marginBottom: '1.5rem' }}>User List</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Role</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem' }}>{u.name}</td>
                        <td style={{ padding: '1rem' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>{u.role}</td>
                        <td style={{ padding: '1rem' }}>{u.is_active ? 'Active' : 'Inactive'}</td>
                        <td style={{ padding: '1rem' }}>
                          {u.role !== 'admin' && <button onClick={() => toggleUserStatus(u.id, u.is_active)} className="admin-btn-outline">Toggle</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="admin-card">
              <h3>{isEditing ? 'Edit Course' : 'Add Course'}</h3>
              <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Title" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} className="admin-input" required />
                <textarea placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} className="admin-input" />
                <input type="text" placeholder="Duration" value={newCourse.duration} onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })} className="admin-input" />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="admin-btn-primary">{isEditing ? 'Update' : 'Add'}</button>
                  {isEditing && <button type="button" onClick={handleCancelEdit} className="admin-btn-outline">Cancel</button>}
                </div>
              </form>
            </div>
            <div className="admin-card">
              {courses.map(c => (
                <div key={c.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{c.title}</span>
                  <div>
                    <button onClick={() => handleEditCourse(c)} className="admin-btn-outline">Edit</button>
                    <button onClick={() => handleDeleteCourse(c.id)} className="admin-btn-outline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="admin-card">
              <h3>Add Video</h3>
              <form onSubmit={handleAddVideo} style={{ display: 'grid', gap: '1rem' }}>
                <input type="text" placeholder="Title" value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} className="admin-input" required />
                <input type="text" placeholder="YouTube ID" value={newVideo.youtube_id} onChange={e => setNewVideo({ ...newVideo, youtube_id: e.target.value })} className="admin-input" required />
                <select value={newVideo.course_id} onChange={e => setNewVideo({ ...newVideo, course_id: e.target.value })} className="admin-input" required>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <button type="submit" className="admin-btn-primary">Upload</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="admin-card">
            <h3>Site Settings</h3>
            <form onSubmit={handleUpdateLinks} style={{ display: 'grid', gap: '1rem' }}>
              <input type="url" placeholder="Webinar URL" value={links.webinar_link} onChange={e => setLinks({ ...links, webinar_link: e.target.value })} className="admin-input" />
              <input type="date" value={links.webinar_date} onChange={e => setLinks({ ...links, webinar_date: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Webinar Time" value={links.webinar_time} onChange={e => setLinks({ ...links, webinar_time: e.target.value })} className="admin-input" />
              <input type="url" placeholder="WhatsApp Link" value={links.whatsapp_link} onChange={e => setLinks({ ...links, whatsapp_link: e.target.value })} className="admin-input" />
              <button type="submit" className="admin-btn-primary">Update Settings</button>
            </form>
          </div>
        )}

        {activeTab === 'webinar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="webinar-mobile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#1e293b', margin: 0 }}>Webinar Registrations</h2>
            </div>

            <div className="admin-card" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
              <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <table className="webinar-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', color: 'white' }}>
                      <th style={{ padding: '1rem' }}>DATE</th>
                      <th style={{ padding: '1rem' }}>NAME</th>
                      <th style={{ padding: '1rem' }}>CONTACT INFO</th>
                      <th style={{ padding: '1rem' }}>DEMOGRAPHICS</th>
                      <th style={{ padding: '1rem' }}>MESSAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(r => (
                      <tr key={r.id} className="webinar-row" style={{ borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '700', color: '#475569' }}>{new Date(r.created_at).toLocaleDateString()}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '700', color: '#1e293b' }}>{r.name}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '600', color: '#1e293b' }}>{r.email}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{r.phone || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '600', color: '#1e293b' }}>{r.age || 'N/A'} yrs</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{r.region || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '1rem', maxWidth: '250px' }}>
                          <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {r.message || '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
