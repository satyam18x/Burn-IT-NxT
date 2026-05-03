'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [videos, setVideos] = useState([]);
  
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [newCourse, setNewCourse] = useState({ title: '', description: '', duration: '', includes: '', image: '', recommended: false });
  const [newVideo, setNewVideo] = useState({ title: '', youtube_id: '', course_id: '', order_index: 0 });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  
  const [assignData, setAssignData] = useState({ userId: '', courseId: '' });
  const [assignments, setAssignments] = useState([]);

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
    } else if (activeTab === 'videos') {
      fetchVideos();
      fetchCourses();
    }
  }, [activeTab, router]);

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
      }
    } catch (err) {
      console.error(err);
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
        body: JSON.stringify({ ...newVideo, module_id: null }) // Default to null/no module
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
    setNewVideo({
      title: v.title,
      youtube_id: v.youtube_id,
      course_id: v.course_id,
      order_index: v.order_index
    });
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
      const res = await fetch(`/api/admin/assignments/${userId}/${courseId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAssignments();
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete course?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCourses();
      }
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
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' }); 
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'var(--color-dark)', color: 'white', padding: '1rem 0' }}>
        <div className="container dashboard-header-flex" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'white' }}>Admin Dashboard</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Admin Mode</span>
            <button className="btn" style={{ background: 'transparent', border: 'none', color: 'white' }} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('users')}>Users</button>
          <button className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('courses')}>Courses</button>
          <button className={`btn ${activeTab === 'videos' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('videos')}>Videos</button>
        </div>

        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Add New User</h3>
              <form onSubmit={handleAddUser} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <input type="text" required placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <input type="email" required placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <input type="password" required placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="btn btn-primary">Add User</button>
              </form>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>User List</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-primary)' }}>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Role</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '1rem' }}>{u.name}</td>
                        <td style={{ padding: '1rem' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>{u.role}</td>
                        <td style={{ padding: '1rem' }}>{u.is_active ? 'Active' : 'Inactive'}</td>
                        <td style={{ padding: '1rem' }}><button onClick={() => toggleUserStatus(u.id, u.is_active)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Toggle</button></td>
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
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Edit Course' : 'Create Course'}</h3>
              <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" required placeholder="Course Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <input type="text" placeholder="Duration" value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <input type="text" placeholder="Image URL" value={newCourse.image} onChange={e => setNewCourse({...newCourse, image: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <input type="text" placeholder="Includes (comma separated)" value={newCourse.includes} onChange={e => setNewCourse({...newCourse, includes: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <textarea placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', minHeight: '100px' }} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Create'}</button>
                  {isEditing && <button type="button" onClick={handleCancelEdit} className="btn btn-outline">Cancel</button>}
                </div>
              </form>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Course List</h3>
              {courses.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <span>{c.title}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditCourse(c)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => handleDeleteCourse(c.id)} className="btn btn-outline" style={{ fontSize: '0.8rem', color: 'red' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Assign Course</h3>
              <form onSubmit={handleAssignCourse} style={{ display: 'flex', gap: '1rem' }}>
                <select required value={assignData.userId} onChange={e => setAssignData({...assignData, userId: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', flexGrow: 1 }}>
                  <option value="">Select User</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
                <select required value={assignData.courseId} onChange={e => setAssignData({...assignData, courseId: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', flexGrow: 1 }}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <button type="submit" className="btn btn-primary">Assign</button>
              </form>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Current Assignments</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-primary)' }}>
                      <th style={{ padding: '1rem' }}>User</th>
                      <th style={{ padding: '1rem' }}>Course</th>
                      <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((a, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div>{a.userName}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{a.userEmail}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>{a.courseTitle}</td>
                        <td style={{ padding: '1rem' }}>
                          <button 
                            onClick={() => handleRemoveAssignment(a.userId, a.courseId)} 
                            className="btn btn-outline" 
                            style={{ fontSize: '0.8rem', color: 'red' }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {assignments.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No assignments found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{editingVideoId ? 'Edit Video' : 'Add Video'}</h3>
              <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" required placeholder="Video Title" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <input type="text" required placeholder="YouTube ID (e.g. dQw4w9WgXcQ)" value={newVideo.youtube_id} onChange={e => setNewVideo({...newVideo, youtube_id: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr' }}>
                  <select required value={newVideo.course_id} onChange={e => setNewVideo({...newVideo, course_id: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px' }}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <input type="number" placeholder="Order Index" value={newVideo.order_index} onChange={e => setNewVideo({...newVideo, order_index: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">{editingVideoId ? 'Update' : 'Add'}</button>
                  {editingVideoId && <button type="button" onClick={() => { setEditingVideoId(null); setNewVideo({ title: '', youtube_id: '', course_id: '', order_index: 0 }); }} className="btn btn-outline">Cancel</button>}
                </div>
              </form>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Video List</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-primary)' }}>
                      <th style={{ padding: '1rem' }}>Title</th>
                      <th style={{ padding: '1rem' }}>Course</th>
                      <th style={{ padding: '1rem' }}>YouTube ID</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map(v => (
                      <tr key={v.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '1rem' }}>{v.title}</td>
                        <td style={{ padding: '1rem' }}>{courses.find(c => c.id == v.course_id)?.title || v.course_id}</td>
                        <td style={{ padding: '1rem' }}><code>{v.youtube_id}</code></td>
                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEditVideo(v)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Edit</button>
                          <button onClick={() => handleDeleteVideo(v.id)} className="btn btn-outline" style={{ fontSize: '0.8rem', color: 'red' }}>Delete</button>
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


