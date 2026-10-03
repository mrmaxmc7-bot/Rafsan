import React from 'react';

interface BloodSplatterOverlayProps {
  showClimaxSplatter: boolean;
  onDismiss?: () => void;
}

export const BloodSplatterOverlay: React.FC<BloodSplatterOverlayProps> = ({
  showClimaxSplatter,
  onDismiss,
}) => {
  if (!showClimaxSplatter) return null;

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden transition-opacity duration-1000 animate-in fade-in"
    >
      {/* Top Left Major Splatter */}
      <svg
        className="absolute -top-6 -left-6 w-72 h-72 md:w-96 md:h-96 text-red-900 fill-current drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] opacity-90"
        viewBox="0 0 200 200"
      >
        <path d="M 0,0 L 150,0 C 130,40 160,80 120,90 C 80,100 110,140 70,160 C 30,170 40,200 0,190 Z" />
        {/* Dripping blood drops */}
        <circle cx="85" cy="180" r="7" className="fill-red-800" />
        <circle cx="85" cy="205" r="4.5" className="fill-red-700" />
        <circle cx="130" cy="115" r="6" className="fill-red-800" />
        <circle cx="130" cy="135" r="3.5" className="fill-red-600" />
        <circle cx="45" cy="210" r="5" className="fill-red-900" />
        <path d="M 70,160 Q 80,220 85,250" stroke="#7f1d1d" strokeWidth="4" fill="none" />
      </svg>

      {/* Top Right Heavy Splatter */}
      <svg
        className="absolute -top-4 -right-4 w-64 h-64 md:w-80 md:h-80 text-red-950 fill-current drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] opacity-85"
        viewBox="0 0 200 200"
      >
        <path d="M 200,0 L 50,0 C 70,50 40,90 90,110 C 130,120 100,160 150,170 C 180,180 170,200 200,190 Z" />
        <circle cx="115" cy="135" r="5.5" className="fill-red-800" />
        <circle cx="140" cy="190" r="4" className="fill-red-700" />
      </svg>

      {/* Bottom Right Corner Splatter with droplets */}
      <svg
        className="absolute -bottom-6 -right-6 w-80 h-80 text-red-900 fill-current drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] opacity-90"
        viewBox="0 0 200 200"
      >
        <path d="M 200,200 L 40,200 C 60,160 30,120 80,100 C 130,85 100,40 160,30 C 180,25 170,0 200,0 Z" />
        <circle cx="120" cy="65" r="6" className="fill-red-700" />
        <circle cx="70" cy="115" r="4" className="fill-red-800" />
      </svg>

      {/* Visceral Screen Vignette Edge */}
      <div className="absolute inset-0 border-[14px] border-red-950/40 pointer-events-none shadow-[inset_0_0_80px_rgba(153,27,27,0.7)]" />
    </div>
  );
};
