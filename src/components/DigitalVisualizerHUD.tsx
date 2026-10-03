import React, { useEffect, useState, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { Activity, ShieldAlert, Cpu, Disc3 } from 'lucide-react';

interface DigitalVisualizerHUDProps {
  isSpeaking: boolean;
  wordCount: number;
  persona: string;
  isNightmare: boolean;
}

export const DigitalVisualizerHUD: React.FC<DigitalVisualizerHUDProps> = ({
  isSpeaking,
  wordCount,
  persona,
  isNightmare,
}) => {
  const [frequencies, setFrequencies] = useState<number[]>(new Array(16).fill(4));
  const animRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array>(new Uint8Array(32));

  useEffect(() => {
    const updateFrequencies = () => {
      audioEngine.getFrequencyData(dataArrayRef.current);
      // Downsample to 16 bars
      const bars: number[] = [];
      for (let i = 0; i < 16; i++) {
        const val = dataArrayRef.current[i];
        // If speaking or sound is playing, use actual frequency; otherwise subtle idle pulse
        const heightPercent = val > 0 ? (val / 255) * 100 : Math.sin(Date.now() * 0.003 + i) * 6 + 10;
        bars.push(Math.max(8, Math.min(100, heightPercent)));
      }
      setFrequencies(bars);
      animRef.current = requestAnimationFrame(updateFrequencies);
    };

    animRef.current = requestAnimationFrame(updateFrequencies);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const intensityLevel = wordCount > 250 ? '🩸 রক্তিম ক্লাইম্যাক্স' : wordCount > 100 ? '⚡ চরম রহস্য' : '🌙 নিঝুম ভৌতিক';

  return (
    <div className="relative w-full glass-iphone p-3.5 md:p-4 overflow-hidden border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
      {/* Corner HUD Reticles */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-red-500 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-red-500 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-red-500 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-red-500 pointer-events-none" />

      {/* Top Telemetry Row */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-zinc-300 gap-2 mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isSpeaking ? 'lighting-red animate-pulse' : 'text-zinc-600'}`} />
          <span className="lighting-red font-bold tracking-wider">HUD // অডিও স্পেকট্রাম</span>
          <span className="px-2 py-0.5 rounded-full bg-red-950/80 text-[10px] lighting-rose border border-red-700/60 shadow">
            {isSpeaking ? '● LIVE SYNTHESIS' : '○ STANDBY'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 lighting-cyan" />
            কথক: <strong className="lighting-gold">{persona}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Disc3 className="w-3.5 h-3.5 lighting-emerald" />
            শব্দ: <strong className="lighting-emerald">{wordCount}</strong>
          </span>
          <span className="flex items-center gap-1 lighting-purple font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            {intensityLevel}
          </span>
        </div>
      </div>

      {/* Visualizer Waveform LED Equalizer Bars */}
      <div className="flex items-end justify-between h-14 md:h-16 gap-1 md:gap-1.5 px-2 py-1 bg-zinc-950/70 rounded-lg border border-red-950">
        {frequencies.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end h-full items-center">
            <div
              style={{ height: `${height}%` }}
              className={`w-full max-w-[14px] rounded-t transition-all duration-75 ${
                height > 75
                  ? 'bg-gradient-to-t from-red-800 via-red-600 to-yellow-400 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                  : height > 40
                  ? 'bg-gradient-to-t from-red-950 via-red-800 to-red-600'
                  : 'bg-red-950/60'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Subtle bottom scan status */}
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <span>24.0 kHz RIFF 16-BIT HIGH-FIDELITY</span>
        <span className={isNightmare ? "text-red-500 font-bold animate-pulse" : ""}>
          {isNightmare ? "⚠️ NIGHTMARE PROTOCOL ENGAGED" : "CYBER-HORROR READY"}
        </span>
      </div>
    </div>
  );
};
