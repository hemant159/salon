"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/super-admin/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setStep('OTP');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/super-admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      // Save the JWT token
      localStorage.setItem('admin_token', data.access_token);
      
      // Redirect to dashboard/subscriptions
      router.push('/subscriptions');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-1">
          Super Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          {step === 'EMAIL' ? 'Enter your admin email to receive a secure code.' : `We sent a 6-digit code to ${email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-4 shadow-2xl shadow-blue-900/5 sm:rounded-2xl sm:px-10 border border-white/50">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {step === 'EMAIL' ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white/50 backdrop-blur-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-200"
                >
                  {loading ? 'Sending...' : 'Send Secure Code'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  6-Digit OTP Code
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full px-4 py-4 border border-gray-200 rounded-xl shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg text-center text-3xl tracking-[0.5em] font-mono text-gray-900 bg-white/50 backdrop-blur-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-200"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('EMAIL')}
                  className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
