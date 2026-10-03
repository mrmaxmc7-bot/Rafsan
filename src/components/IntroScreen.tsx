import React, { useState } from 'react';
import { APP_LOGO_SRC, APP_NAME, APP_EST } from '../assets/logo';
import { audioEngine } from '../utils/audioEngine';
import { speechEngine, DEFAULT_USER_PROFILE } from '../utils/speechEngine';
import { Skull, LogIn, Lock, ArrowRight, Phone, Sparkles, Volume2 } from 'lucide-react';

interface IntroScreenProps {
  onEnter: (userName: string, method: string) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [authTab, setAuthTab] = useState<'quick' | 'google' | 'facebook' | 'phone'>('quick');
  const [isEntering, setIsEntering] = useState(false);

  const handleProceed = async (selectedName: string, method: string) => {
    if (isEntering) return;
    setIsEntering(true);

    const finalName = selectedName.trim() || 'সুমন শিকদার (মালিক)';

    // 1. Initialize audio and trigger terrifying horror entrance soundscape
    audioEngine.init();
    await audioEngine.playEntranceExperience();

    // 2. Trigger realistic terrifying entrance announcement
    const entranceText = "ভয়ের জগতে আপনাকে স্বাগতম... তুমি এবার মরবে...";
    try {
      await speechEngine.speakText(entranceText, {
        persona: 'Charon',
        pitch: 0.65,
        rate: 0.8,
        echoEnabled: true,
        echoIntensity: 0.7,
      });
    } catch {
      // Audio engine already played atmospheric rumble
    }

    // 3. Post to backend visitor audit log
    try {
      await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalName,
          authMethod: method,
        }),
      });
    } catch (e) {
      console.warn("Could not log visitor", e);
    }

    // 4. Smooth transition into the studio
    setTimeout(() => {
      onEnter(finalName, method);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-scanlines px-4 py-8 overflow-y-auto">
      {/* Background Red Atmospheric Pulse */}
      <div className="absolute inset-0 bg-radial from-red-950/40 via-black to-black pointer-events-none" />

      {/* Glassmorphic Portal Modal */}
      <div className="relative w-full max-w-md mx-auto my-auto glass-panel rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(220,38,38,0.45)] border border-red-800/70">
        {/* Corner Reticle Accents */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-red-500 pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-red-500 pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-red-500 pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-red-500 pointer-events-none" />

        {/* Central Official Glowing Emblem */}
        <div className="relative mx-auto w-36 h-36 md:w-44 md:h-44 mb-4 group floating-elem">
          <div className="absolute inset-0 rounded-full bg-red-600/35 blur-xl animate-pulse group-hover:bg-red-600/50 transition-all" />
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.7)]">
            <img
              src={APP_LOGO_SRC}
              alt="sksumonxhikder emblem"
              className="w-full h-full object-cover scale-105"
            />
          </div>
        </div>

        {/* Luminous Glowing Title and Tagline */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest font-cyber luminous-text drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]">
          {APP_NAME}
        </h1>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 my-2 rounded-full bg-red-950/80 border border-red-700/80 text-xs font-mono text-red-300 shadow">
          <Skull className="w-3.5 h-3.5 text-red-400" />
          <span>{APP_EST}</span>
          <span>•</span>
          <span className="text-amber-300 font-bold">আমার কণ্ঠ সমর্থিত</span>
        </div>

        <p className="text-sm text-zinc-200 font-bangla mb-5 leading-relaxed">
          ভয়ের জগতে আপনাকে স্বাগতম... অন্ধকার মহাকাব্যের দ্বার খুলতে প্রস্তুত তো?
        </p>

        {/* Multi-Method Login Interface */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-1 p-1 bg-black/60 rounded-xl border border-red-950 mb-4 text-xs font-mono">
            <button
              onClick={() => setAuthTab('quick')}
              className={`py-1.5 rounded-lg transition-all ${
                authTab === 'quick'
                  ? 'bg-red-900 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              সরাসরি
            </button>
            <button
              onClick={() => setAuthTab('google')}
              className={`py-1.5 rounded-lg transition-all ${
                authTab === 'google'
                  ? 'bg-red-900 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setAuthTab('phone')}
              className={`py-1.5 rounded-lg transition-all ${
                authTab === 'phone'
                  ? 'bg-red-900 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ফোন/নাম
            </button>
          </div>

          {/* Direct Quick Entrance */}
          {authTab === 'quick' && (
            <div className="space-y-3">
              <button
                disabled={isEntering}
                onClick={() => handleProceed('সুমন শিকদার (প্রধান ব্যবহারকারী)', 'সরাসরি প্রবেশ (Owner Profile)')}
                className="w-full group relative overflow-hidden py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white font-bold font-bangla text-lg shadow-[0_0_30px_rgba(220,38,38,0.7)] hover:shadow-[0_0_40px_rgba(239,68,68,0.9)] transition-all transform active:scale-95 disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  <Skull className="w-5 h-5 text-red-200" />
                  {isEntering ? 'দ্বার উন্মুক্ত হচ্ছে...' : 'প্রবেশ করুন / ENTER THE ABYSS'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <p className="text-[11px] text-zinc-400 font-mono">
                *প্রবেশের সাথে সাথেই ভয়ঙ্কর সিনেম্যাটিক গর্জন ও রক্তহিম কণ্ঠস্বর শুনতে পাবেন
              </p>
            </div>
          )}

          {/* Google Auth Mock-Flow */}
          {authTab === 'google' && (
            <div className="space-y-3">
              <button
                disabled={isEntering}
                onClick={() => handleProceed('Google Verified User', 'Google Sign-In')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-red-800/60 text-white font-mono text-sm transition-all shadow hover:border-red-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.6 7c-.8 1.6-1.3 3.4-1.3 5.3s.5 3.7 1.3 5.3l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                disabled={isEntering}
                onClick={() => handleProceed('Facebook Member', 'Facebook Sign-In')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#1877F2]/90 hover:bg-[#1877F2] text-white font-mono text-sm transition-all shadow"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>
          )}

          {/* Name & Phone Auth */}
          {authTab === 'phone' && (
            <div className="space-y-2.5 text-left">
              <div>
                <label className="text-[11px] font-mono text-zinc-400">আপনার নাম:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="যেমন: সুমন শিকদার"
                  className="w-full mt-1 px-3 py-2 bg-black/80 border border-red-900 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-400">মোবাইল নম্বর (ঐচ্ছিক):</label>
                <div className="relative mt-1">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 bg-black/80 border border-red-900 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <button
                disabled={isEntering}
                onClick={() => handleProceed(userName || 'আইডি গ্রাহক', `Phone: ${userPhone || 'Not given'}`)}
                className="w-full mt-2 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold font-bangla text-sm shadow transition-all"
              >
                সাইন ইন করে প্রবেশ করুন
              </button>
            </div>
          )}
        </div>

        {/* Security & Owner Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-mono">
          <Lock className="w-3 h-3 text-red-500" />
          <span>SKSUMONXHIKDER Secure System • v3.0 Glass Edition</span>
        </div>
      </div>
    </div>
  );
};
