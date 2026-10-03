import React from 'react';
import { APP_LOGO_SRC, APP_NAME, MENACING_WARNING } from '../assets/logo';
import { Moon, Skull, ShieldCheck, Flame } from 'lucide-react';

interface NightmareHeaderProps {
  isNightmare: boolean;
  onToggleNightmare: () => void;
  onOpenOwnerPortal: () => void;
  onTriggerSplatter: () => void;
}

export const NightmareHeader: React.FC<NightmareHeaderProps> = ({
  isNightmare,
  onToggleNightmare,
  onOpenOwnerPortal,
  onTriggerSplatter,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/60 backdrop-blur-2xl px-3 md:px-6 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        {/* Left: Brand Logo & Title with Menacing Bengali Warning */}
        <div className="flex items-center gap-2.5 md:gap-3.5 min-w-0">
          <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.8)] flex-shrink-0 floating-elem">
            <img src={APP_LOGO_SRC} alt="logo" className="w-full h-full object-cover scale-110" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-red-600 border border-black animate-ping" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:gap-3 min-w-0">
            <span className="text-xl md:text-2xl font-black tracking-wider lighting-red font-cyber truncate">
              {APP_NAME}
            </span>

            {/* Menacing Warning "তুমি এবার মরবে" (You will die now) */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/70 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs md:text-sm font-bold lighting-rose font-bangla flicker-text tracking-wide whitespace-nowrap">
                {MENACING_WARNING}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Blood Splatter manual trigger */}
          <button
            onClick={onTriggerSplatter}
            title="রক্তের ছিটা সক্রিয় করুন"
            className="p-1.5 md:px-3 md:py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-700/80 text-xs font-mono text-red-200 flex items-center gap-1.5 transition-all shadow"
          >
            <Flame className="w-3.5 h-3.5 lighting-red" />
            <span className="hidden sm:inline lighting-rose">রক্তিম ক্লাইম্যাক্স</span>
          </button>

          {/* Nightmare Mode Toggle Switch */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10">
            <button
              onClick={onToggleNightmare}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                isNightmare
                  ? 'bg-red-700 text-white shadow-[0_0_18px_rgba(239,68,68,0.8)]'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Skull className={`w-3.5 h-3.5 ${isNightmare ? 'animate-spin lighting-gold' : ''}`} />
              <span className={`hidden sm:inline ${isNightmare ? 'lighting-gold' : ''}`}>নাইটমেয়ার মোড</span>
              <span className="sm:hidden">NIGHTMARE</span>
            </button>
          </div>

          {/* Secret Owner Portal Access Icon */}
          <button
            onClick={onOpenOwnerPortal}
            title="মালিক প্যানেল (Owner Access)"
            className="p-2 rounded-xl bg-black/80 hover:bg-red-950/80 border border-white/10 hover:border-red-600 text-zinc-400 hover:text-red-400 transition-colors shadow"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
