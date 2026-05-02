import React from 'react';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div>
      <section className="section-padding dark-section text-center" style={{ minHeight: '30vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '1rem' }}>Get in Touch</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'rgba(255,255,255,0.8)' }}>
            Have questions about our programs or need support? We're here to help.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(2rem, 5vw, 4rem)' }}>
            
            {/* Contact Form */}
            <div className="card" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              <h2 style={{ marginBottom: '2rem' }}>Send Us a Message</h2>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-dark)' }}>Name</label>
                  <input type="text" placeholder="Jane Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-dark)' }}>Email</label>
                  <input type="email" placeholder="jane@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-dark)' }}>Message</label>
                  <textarea rows="5" placeholder="How can we help you?" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none', resize: 'vertical' }}></textarea>
                </div>
                <button type="button" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Submit Message</button>
              </form>
            </div>

            {/* Contact Info & Socials */}
            <div>
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Direct Contact</h3>
                <a href="#" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', fontSize: '1.1rem', marginBottom: '1rem', width: 'fit-content' }}>
                  <MessageCircle size={24} /> Chat with us on WhatsApp
                </a>
                <a href="#" className="btn btn-outline" style={{ border: '2px solid var(--color-primary)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', fontSize: '1.1rem', width: 'fit-content' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Follow on Instagram
                </a>
              </div>

              <div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Contact Info</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--color-text)' }}>
                    <Mail color="var(--color-primary)" /> support@burnitout.fitness
                  </li>
                  <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--color-text)' }}>
                    <MapPin color="var(--color-primary)" /> Remote/Online Operations, Global
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
