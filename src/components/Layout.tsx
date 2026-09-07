import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-x-hidden selection:bg-white selection:text-black">
      {/* Fullscreen Video Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        />
        {/* Cinematic dark scrim overlay to ensure contrast and readability */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]" />
      </div>

      {/* Floating Glassmorphic Navbar */}
      <Navbar />

      {/* Dynamic Page Views */}
      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}
