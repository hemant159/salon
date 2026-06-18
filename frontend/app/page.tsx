'use client';

import Link from 'next/link';
import { ArrowRight, Scissors, Sparkles, Droplets, SprayCan, Beaker, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>
      
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: scrolled ? 'rgba(0,0,0,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <div style={{ fontSize: '14px', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.7)' }}>
            PHONE: 505-707-5050
          </div>
        </div>

        <div style={{ display: 'none', gap: '40px', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.15em', '@media (min-width: 768px)': { display: 'flex' } } as React.CSSProperties}>
          <a href="#services" style={{ color: '#fff', textDecoration: 'none' }}>Services</a>
          <a href="#team" style={{ color: '#fff', textDecoration: 'none' }}>Team</a>
          <a href="#contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a>
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
      </nav>

      {/* Hero Section */}
      <header style={{
        position: 'relative', height: '100vh', minHeight: '600px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundImage: 'url(/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center 30%',
        textAlign: 'center',
      }}>
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-panel) 0%, rgba(0,0,0,0.8) 100%)', zIndex: 1 }} />
        
        {/* Left Logo (Absolute) */}
        <div style={{
          position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          opacity: 0.8
        }}>
          <Scissors size={32} />
          <div style={{ fontSize: '10px', letterSpacing: '0.2em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>BARBERSHOP</div>
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', padding: '0 20px' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(50px, 10vw, 100px)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '16px',
            color: '#ffffff',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            Barbershop
          </h1>
          <p style={{
            fontSize: '16px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '40px'
          }}>
            AI Consultation Platform
          </p>
          
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            fontSize: '14px', letterSpacing: '0.05em', color: '#fff', textDecoration: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '6px',
            transition: 'all 0.3s ease'
          }}>
            Online portal access <ArrowRight size={16} />
          </Link>
        </div>

        {/* Scroll badge */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, width: '100px', height: '100px',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'spin 20s linear infinite'
        }}>
          <div style={{ position: 'absolute', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)' }}>
            SCROLL FOR MORE
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fff' }} />
        </div>
      </header>

      <main style={{ padding: '100px 5vw', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Section 1 */}
        <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px', marginBottom: '120px' }}>
          <div style={{ flex: '1 1 400px' }}>
            <img src="/service1.png" alt="Consultation" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: '1 1 400px', paddingRight: '2vw' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', fontWeight: 400, marginBottom: '30px', lineHeight: 1.2 }}>
              Precision AI Analysis<br />and Style Suggestions
            </h2>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '30px' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
              Elevate your consultation process. Our AI engine analyzes facial structure, hair texture, and current trends to provide the mathematically perfect style for every client.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.8 }}>
              Stop guessing and start visualizing. Show your clients exactly how they will look before the scissors ever touch their hair.
            </p>
          </div>
        </section>

        {/* Section 2 (Reversed) */}
        <section style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '60px', marginBottom: '120px' }}>
          <div style={{ flex: '1 1 400px', paddingLeft: '2vw' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', fontWeight: 400, marginBottom: '30px', lineHeight: 1.2 }}>
              Boost Client Retention<br />by up to 80%
            </h2>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '30px' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
              Clients who can visualize their results are significantly more likely to return. Build unparalleled trust by ensuring perfect communication and managing expectations.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.8 }}>
              Store client history securely in our portal, allowing you to instantly recall their past styles, preferences, and AI consultations on their next visit.
            </p>
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <img src="/service2.png" alt="Premium Products" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
          </div>
        </section>

        {/* Section 3 */}
        <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px', marginBottom: '140px' }}>
          <div style={{ flex: '1 1 400px' }}>
            <img src="/service3.png" alt="Premium Experience" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: '1 1 400px', paddingRight: '2vw' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', fontWeight: 400, marginBottom: '30px', lineHeight: 1.2 }}>
              A Premium Visual<br />Experience
            </h2>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)', marginBottom: '30px' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
              From classic fades to modern texturing, our platform caters to all grooming needs. Simply snap a photo with your tablet, and within seconds present 3 hyper-realistic outcomes.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.8 }}>
              Modernize your barbershop while maintaining the classic, timeless art of grooming.
            </p>
          </div>
        </section>

        {/* Services Grid Section */}
        <section id="services" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '80px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', fontWeight: 400, marginBottom: '40px' }}>Our AI Services</h2>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              fontSize: '14px', letterSpacing: '0.05em', color: '#fff', textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '6px',
            }}>
              Staff Portal <ArrowRight size={16} />
            </Link>
          </div>
          
          <div style={{ flex: '2 1 600px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.1)' }}>
            
            {[
              { icon: Scissors, title: 'Classic Haircut', sub: 'Analyzed' },
              { icon: Sparkles, title: 'Fade', sub: 'Perfected' },
              { icon: Droplets, title: 'Color + Cut', sub: 'Visualized' },
              { icon: SprayCan, title: 'Beard', sub: 'Short - Long' },
              { icon: CheckCircle, title: 'Beard Styling', sub: 'Outlined' },
              { icon: Beaker, title: 'Facial', sub: 'Rejuvenation' },
            ].map((s, i) => (
              <div key={i} style={{
                background: '#000',
                padding: '40px 20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', transition: 'background 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#0a0a0a'}
              onMouseLeave={e => e.currentTarget.style.background = '#000'}
              >
                <s.icon size={32} strokeWidth={1} style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.8)' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 400, marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '12px', color: '#c59d5f', letterSpacing: '0.05em' }}>{s.sub}</p>
              </div>
            ))}

          </div>
        </section>

      </main>

      <footer style={{ padding: '60px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} The Salon App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
