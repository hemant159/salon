"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    
    if (!token && pathname !== '/login') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/login');
  };

  // Wait for auth check
  if (isAuthenticated === null && pathname !== '/login') {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  // If on login page, don't show the sidebar
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-full shrink-0 shadow-lg">
        <div className="p-6 text-2xl font-bold tracking-tight border-b border-gray-800">
          AI Salon Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-3 rounded-md hover:bg-gray-800 transition">Dashboard</Link>
          <Link href="/salons" className="block px-4 py-3 rounded-md hover:bg-gray-800 transition">Salons & Tenants</Link>
          <Link href="/subscriptions" className="block px-4 py-3 rounded-md hover:bg-gray-800 transition">Subscriptions</Link>
          <Link href="/ai-settings" className="block px-4 py-3 rounded-md hover:bg-gray-800 transition">AI Engine Settings</Link>
          <Link href="/reports" className="block px-4 py-3 rounded-md hover:bg-gray-800 transition">Reports & Analytics</Link>
          <Link href="/settings" className="block px-4 py-3 rounded-md hover:bg-gray-800 transition">Platform Settings</Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-md hover:bg-red-900/50 text-red-400 transition font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
