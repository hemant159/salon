'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Image as ImageIcon, ArrowRight, X, Plus, RotateCcw } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import { getConsultState, setConsultState } from '@/lib/store';
import TopBar from '@/components/layout/TopBar';

export default function CapturePage() {
  const router = useRouter();
  const galleryRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [previews, setPreviews] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    const state = getConsultState();
    if (!state.gender) { router.replace('/home'); return; }
    if (state.photoPreviews && state.photoPreviews.length > 0) {
      setPreviews(state.photoPreviews);
    }

    return () => {
      stopCamera(); // Cleanup on unmount
    };
  }, [router]);

  async function startCamera() {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error(err);
      setCameraError('Camera access denied or unavailable. Please upload from gallery instead.');
      setShowCamera(false);
    }
  }

  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [showCamera]);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }

  function takeSnapshot() {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      setPreviews(prev => {
        const combined = [...prev, dataUrl];
        setConsultState({ photoPreviews: combined });
        return combined;
      });
      
      stopCamera();
    }
  }

  function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews: string[] = [];
    let processed = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        newPreviews.push(dataUrl);
        processed++;
        if (processed === files.length) {
          setPreviews(prev => {
            const combined = [...prev, ...newPreviews];
            setConsultState({ photoPreviews: combined });
            return combined;
          });
        }
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  }

  function removePhoto(index: number) {
    setPreviews(prev => {
      const updated = prev.filter((_, i) => i !== index);
      setConsultState({ photoPreviews: updated });
      return updated;
    });
  }

  function handleContinue() {
    router.push('/consult/services');
  }

  if (showCamera) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel), transparent)' }}>
          <button onClick={stopCamera} style={{ color: 'white', padding: '8px' }}>
            <X size={24} />
          </button>
          <span style={{ color: 'white', fontWeight: 600 }}>Take Photo</span>
          <div style={{ width: '40px' }} />
        </div>
        
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-panel), transparent)' }}>
          <button
            onClick={takeSnapshot}
            style={{
              width: '72px', height: '72px',
              borderRadius: '50%',
              background: 'transparent',
              border: '4px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'white' }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <TopBar title="Capture Photos" showBack backHref="/consult/client" />

      <div className="content">
        <div className="fu" style={{ marginBottom: '24px' }}>
          <div className="eyebrow">Step 2 of 4</div>
          <h2 style={{ fontSize: '24px' }}>Analyze the Canvas</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
            The AI needs clear shots of the face and hair. You can add multiple angles.
          </p>
          {cameraError && (
            <div className="error-box" style={{ marginTop: '12px' }}>{cameraError}</div>
          )}
        </div>
        
        <input
          type="file"
          accept="image/*"
          multiple
          ref={galleryRef}
          onChange={handleGallery}
          style={{ display: 'none' }}
        />

        <div className="fu1" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Photo Grid */}
          {previews.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: previews.length === 1 ? '1fr' : '1fr 1fr',
              gap: '12px'
            }}>
              {previews.map((src, i) => (
                <div key={i} style={{
                  position: 'relative',
                  width: '100%', aspectRatio: previews.length === 1 ? '3/4' : '1/1',
                  borderRadius: 'var(--r-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => removePhoto(i)}
                    style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: '28px', height: '28px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {previews.length > 0 && (
                <button
                  className="panel panel-interactive"
                  onClick={startCamera}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    aspectRatio: previews.length === 1 ? '3/4' : '1/1',
                    gap: '8px',
                    border: '1px dashed var(--border-mid)',
                    background: 'var(--purple-subtle)'
                  }}
                >
                  <Plus size={24} color="var(--purple-light)" />
                  <span style={{ fontSize: '12px', color: 'var(--purple-light)', fontWeight: 500 }}>Add Photo</span>
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {previews.length === 0 ? (
            <>
              <button
                className="panel panel-interactive"
                onClick={startCamera}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '48px 24px', gap: '16px', width: '100%',
                }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'var(--purple-subtle)', border: '1px solid rgba(139,92,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--purple-light)',
                }}>
                  <Camera size={28} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>Take a Photo</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Use built-in camera</div>
                </div>
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => galleryRef.current?.click()}
              >
                <ImageIcon size={16} /> Upload from Gallery
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => galleryRef.current?.click()}
                style={{ flex: 1 }}
              >
                <ImageIcon size={16} /> Gallery
              </button>
              <button className="btn btn-primary" onClick={handleContinue} style={{ flex: 2 }}>
                Looks Good <ArrowRight size={16} />
              </button>
            </div>
          )}

          {previews.length === 0 && (
            <>
              <div className="divider" />
              <button className="btn btn-ghost" onClick={handleContinue}>
                Skip Photos (Manual input only)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
