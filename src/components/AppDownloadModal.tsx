import React from 'react';
import { X, Download, Smartphone, Monitor, CheckCircle, Apple, Chrome, Share2, HardDrive } from 'lucide-react';
import { APP_NAME, APP_LOGO_SRC, APP_EST } from '../assets/logo';

interface AppDownloadModalProps {
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl glass-iphone-elevated p-6 md:p-8 border border-red-500/40 shadow-[0_20px_60px_rgba(220,38,38,0.4)] space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.7)] flex-shrink-0">
            <img src={APP_LOGO_SRC} alt="logo" className="w-full h-full object-cover scale-105" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-cyber lighting-red">
              {APP_NAME} APP DOWNLOAD
            </h3>
            <p className="text-xs font-bangla text-zinc-300">
              আপনার ফোনে বা কম্পিউটারে সম্পূর্ণ অ্যাপটি ইনস্টল করে সরাসরি ব্যবহার করুন
            </p>
          </div>
        </div>

        {/* Step-by-Step Installation Instructions */}
        <div className="space-y-3 text-xs font-bangla">
          {/* Android */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 font-bold lighting-emerald text-sm">
              <Smartphone className="w-4 h-4" />
              <span>অ্যান্ড্রয়েড ফোন (Android Chrome):</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              ১. ব্রাউজারের উপরে ডানদিকের তিনটি বিন্দু (<strong>⋮</strong>) চাপুন।<br />
              ২. <strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যোগ করুন) বাটনে চাপুন।<br />
              ৩. অ্যাপটি আপনার ফোনের হোম স্ক্রিনে অ্যাপ আইকন আকারে সেভ হয়ে যাবে।
            </p>
          </div>

          {/* iPhone / iOS */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 font-bold lighting-cyan text-sm">
              <Apple className="w-4 h-4" />
              <span>আইফোন / আইপ্যাড (iPhone Safari):</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              ১. সাফারির নিচে শেয়ার বাটন (<strong>Share Icon <Share2 className="w-3 h-3 inline" /></strong>) চাপুন।<br />
              ২. স্ক্রল করে নিচে <strong>"Add to Home Screen"</strong> (হোম স্ক্রিনে যোগ করুন) সিলেক্ট করুন।<br />
              ৩. এবার উপরে <strong>"Add"</strong> বাটনে ক্লিক করলেই আইফোনের অ্যাপের মতো ফুলস্ক্রিনে চলবে!
            </p>
          </div>

          {/* Computer / Windows / Mac */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 font-bold lighting-gold text-sm">
              <Monitor className="w-4 h-4" />
              <span>কম্পিউটার (Windows / Mac Chrome & Edge):</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              ১. ব্রাউজারের অ্যাড্রেস বারের ঠিক ডানপাশে থাকা <strong>Install Icon (ডাউনলোড বাটন)</strong> ক্লিক করুন।<br />
              ২. <strong>"Install"</strong> বাটনে চাপলেই এটি একটি আলাদা সফটওয়্যার উইন্ডোতে ওপেন হবে।
            </p>
          </div>
        </div>

        {/* Offline Audio and Story Features */}
        <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <HardDrive className="w-4 h-4 lighting-red" />
            <span>অফলাইন অডিও ও গল্প সেভ সুবিধা সক্রিয়</span>
          </div>
          <span className="lighting-emerald font-bold">✓ PWA Ready</span>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-bangla font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.6)]"
        >
          বুঝেছি, বন্ধ করুন
        </button>
      </div>
    </div>
  );
};
