'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, User, Calendar, Send, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Simple Client-Side Validations
    if (!form.fullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setErrorMsg('A valid email address is required.');
      return;
    }
    if (!form.message.trim()) {
      setErrorMsg('Message is required.');
      return;
    }

    setLoading(true);
    
    // Simulate API request call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setForm({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setErrorMsg('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-shell">
      <div className="contact-bg-overlay" />
      <div className="contact-gradient-overlay" />

      {/* Navbar */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-nav-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ fontSize: '14px', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.7)' }}>
              PHONE: 505-707-5050
            </div>
          </div>

          <div className="landing-nav-links">
            <Link href="/#services" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Services</Link>
            <Link href="/#team" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Team</Link>
            <Link href="/contact" style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid #fff', paddingBottom: '2px' }}>Contact</Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/login" style={{
              fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em',
              color: '#fff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)',
              paddingBottom: '2px', transition: 'border-color 0.3s ease'
            }}>
              Staff Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="contact-main">
        
        {/* Contact Grid layout */}
        <div className="contact-grid">
          
          {/* Info Column */}
          <div className="contact-info-col">
            <span className="contact-eyebrow">Get In Touch</span>
            <h1 className="contact-title">We&apos;d love to hear from you</h1>
            <p className="contact-desc">
              Have questions about our services or want to schedule an appointment? Reach out and we&apos;ll get back to you as soon as possible.
            </p>

            <div className="contact-cards-list">
              
              {/* Phone card */}
              <div className="contact-info-card">
                <div className="contact-card-icon-wrapper">
                  <Phone size={20} strokeWidth={1.5} />
                </div>
                <div className="contact-card-content">
                  <span className="contact-card-label">Phone</span>
                  <span className="contact-card-value">505-707-5050</span>
                  <span className="contact-card-subtext">Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>

              {/* Email card */}
              <div className="contact-info-card">
                <div className="contact-card-icon-wrapper">
                  <Mail size={20} strokeWidth={1.5} />
                </div>
                <div className="contact-card-content">
                  <span className="contact-card-label">Email</span>
                  <span className="contact-card-value">abcd@gmail.com</span>
                  <span className="contact-card-subtext">We reply within 2 hours</span>
                </div>
              </div>

              {/* Address card */}
              <div className="contact-info-card">
                <div className="contact-card-icon-wrapper">
                  <MapPin size={20} strokeWidth={1.5} />
                </div>
                <div className="contact-card-content">
                  <span className="contact-card-label">Address</span>
                  <span className="contact-card-value">123 Barber Street, Suite 100</span>
                  <span className="contact-card-subtext">Albuquerque, NM 87101</span>
                </div>
              </div>

            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-col">
            <div className="contact-form-panel">
              {success ? (
                <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <CheckCircle2 size={56} color="#c59d5f" strokeWidth={1.5} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 400 }}>Thank You!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', maxWidth: '320px', lineHeight: 1.6 }}>
                    Your message has been sent successfully. We will review your request and get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="btn btn-secondary"
                    style={{ marginTop: '10px' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="contact-form-row">
                    <div className="contact-input-group">
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="contact-form-input"
                        required
                      />
                    </div>
                    <div className="contact-input-group">
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="contact-form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-input-group">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="contact-form-input"
                    />
                  </div>

                  <div className="contact-input-group">
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      className="contact-form-input"
                    />
                  </div>

                  <div className="contact-input-group">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Message"
                      className="contact-form-input contact-form-textarea"
                      required
                    />
                  </div>

                  {errorMsg && <div className="error-box">{errorMsg}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="contact-btn-submit"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="spin" /> Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message <Send size={14} />
                      </>
                    )}
                  </button>

                  <div className="contact-security-note">
                    <Lock size={12} style={{ color: '#c59d5f' }} />
                    <span>Your information is safe with us. We never share your data.</span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Bottom features / Quick support */}
        <div className="contact-footer-features">
          
          <div className="contact-feature-item">
            <Clock size={24} className="contact-feature-icon" strokeWidth={1.5} />
            <div className="contact-feature-text">
              <span className="contact-feature-title">Quick Response</span>
              <span className="contact-feature-desc">We respond within 2 hours</span>
            </div>
          </div>

          <div className="contact-feature-item">
            <User size={24} className="contact-feature-icon" strokeWidth={1.5} />
            <div className="contact-feature-text">
              <span className="contact-feature-title">Expert Support</span>
              <span className="contact-feature-desc">Our team is here to help</span>
            </div>
          </div>

          <div className="contact-feature-item">
            <Calendar size={24} className="contact-feature-icon" strokeWidth={1.5} />
            <div className="contact-feature-text">
              <span className="contact-feature-title">Easy Booking</span>
              <span className="contact-feature-desc">Schedule your appointment</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
