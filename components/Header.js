'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem('user');
        setUser(null);
      }
    }
  }, [pathname]);

  const isActive = (path) => {
    return pathname === path ? 'active' : '';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <header>
      <div className="container" style={{ position: 'relative' }}>
        <Link href="/" className="logo">
          <img src="/assets/logo.jpeg" alt="Burn It Out Logo" style={{ height: 'clamp(40px, 10vw, 64px)', objectFit: 'contain' }} />
          Burn IT Out<span>  Fitness</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links desktop-only">
          <Link href="/" className={isActive('/')}>Home</Link>
          <Link href="/about" className={isActive('/about')}>About</Link>
          <Link href="/programs" className={isActive('/programs')}>Programs</Link>
          <Link href="/success-stories" className={isActive('/success-stories')}>Success Stories</Link>
          <Link href="/contact" className={isActive('/contact')}>Webinar</Link>
        </nav>

        <div className="nav-actions desktop-only">
          {user ? (
            <>
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="login-link">Dashboard</Link>
              <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--color-dark)', color: 'var(--color-dark)', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="login-link">Login</Link>
              <Link href="/programs" className="btn btn-primary">View Programs</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="mobile-menu-btn mobile-only" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={32} /> : <Menu size={32} />}
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          <Link href="/" className={isActive('/')} onClick={toggleSidebar}>Home</Link>
          <Link href="/about" className={isActive('/about')} onClick={toggleSidebar}>About</Link>
          <Link href="/programs" className={isActive('/programs')} onClick={toggleSidebar}>Programs</Link>
          <Link href="/success-stories" className={isActive('/success-stories')} onClick={toggleSidebar}>Success Stories</Link>
          <Link href="/contact" className={isActive('/contact')} onClick={toggleSidebar}>Contact</Link>
          <hr style={{ borderColor: 'rgba(0,0,0,0.1)', margin: '1rem 0' }} />
          {user ? (
            <>
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="login-link" onClick={toggleSidebar}>Dashboard</Link>
              <button onClick={() => { handleLogout(); toggleSidebar(); }} className="btn btn-primary" style={{ marginTop: '1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="login-link" onClick={toggleSidebar}>Login</Link>
              <Link href="/programs" className="btn btn-primary" style={{ textAlign: 'center', marginTop: '1rem' }} onClick={toggleSidebar}>View Programs</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
