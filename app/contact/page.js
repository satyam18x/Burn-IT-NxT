'use client';

import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, User, Phone, Map, Calendar, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    region: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch('/api/webinar-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', age: '', phone: '', region: '', message: '' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div>
      <style>{`
        .contact-hero {
          background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/assets/transform.jpeg');
          background-size: cover;
          background-position: center;
          min-height: 40vh;
          display: flex;
          align-items: center;
          text-align: center;
        }
        .form-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 3rem;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          background: #f8fafc;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }
        .form-input:focus {
          border-color: var(--color-primary);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(255,106,0,0.1);
        }
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          color: #94a3b8;
          transition: color 0.3s ease;
        }
        .input-group:focus-within .input-icon {
          color: var(--color-primary);
        }
        .registration-card {
          background: #fff;
          border-radius: 24px;
          padding: clamp(1.5rem, 5vw, 3rem);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
        }
      `}</style>

      <section className="contact-hero section-padding text-center">
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '1rem', color: '#fff', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Register for our <span style={{ color: 'var(--color-primary)' }}>Live Webinar</span>
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
            Join our exclusive session on Sustainable Fat Loss and Postpartum Recovery. Fill out the form below to secure your spot.
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: '#fcfcfc' }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            
            {/* Registration Form */}
            <div className="registration-card">
              {status.success ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{ width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyInContent: 'center', margin: '0 auto 2rem', color: '#10b981' }}>
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>Registration Successful!</h2>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Thank you for registering. We've received your details and will send you the webinar link shortly via email and WhatsApp.
                  </p>
                  <button onClick={() => setStatus({ success: false })} className="btn btn-primary">Register Another Person</button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#1e293b' }}>Join the Webinar</h2>
                  <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Limited spots available. Reserve yours today!</p>
                  
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="input-group">
                      <User className="input-icon" size={20} />
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className="form-input" />
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className="form-input" />
                      </div>
                      <div className="input-group">
                        <Calendar className="input-icon" size={20} />
                        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="form-input" />
                      </div>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="input-group">
                        <Phone className="input-icon" size={20} />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="form-input" />
                      </div>
                      <div className="input-group">
                        <Map className="input-icon" size={20} />
                        <input type="text" name="region" value={formData.region} onChange={handleChange} placeholder="Area / Region" className="form-input" />
                      </div>
                    </div>

                    <div className="input-group" style={{ alignItems: 'flex-start' }}>
                      <MessageCircle className="input-icon" size={20} style={{ top: '1rem' }} />
                      <textarea name="message" rows="4" value={formData.message} onChange={handleChange} placeholder="Any specific goals or questions?" className="form-input" style={{ resize: 'none' }}></textarea>
                    </div>

                    {status.error && (
                      <p style={{ color: '#ef4444', fontSize: '0.9rem', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fee2e2' }}>{status.error}</p>
                    )}

                    <button type="submit" disabled={status.loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      {status.loading ? 'Registering...' : <><Send size={20} /> Register Now</>}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Info Section */}
            <div>
              <div style={{ marginBottom: '3.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ padding: '8px', background: 'rgba(255,106,0,0.1)', borderRadius: '8px', color: 'var(--color-primary)' }}><Calendar size={24} /></div>
                   What to expect
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    "Live Q&A with our Head Trainer",
                    "Customized Fat Loss Blueprints",
                    "Sustainable Home Workout Strategies",
                    "Nutrition Hacks for Busy Moms"
                  ].map((text, i) => (
                    <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#475569', fontSize: '1.1rem' }}>
                      <CheckCircle2 size={20} color="#10b981" /> {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '2rem', background: 'var(--color-dark)', borderRadius: '20px', color: '#fff' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Connect Directly</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <a href="https://wa.me/yournumber" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                    <MessageCircle size={20} /> Chat on WhatsApp
                  </a>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                      <Mail size={20} color="var(--color-primary)" /> support@burnitout.fitness
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'rgba(255,255,255,0.7)' }}>
                      <MapPin size={20} color="var(--color-primary)" /> Global Online Operations
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
