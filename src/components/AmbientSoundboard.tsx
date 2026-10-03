import React, { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { Volume2, VolumeX, CloudLightning, Ghost, Skull, HeartPulse, Clock, Sparkles } from 'lucide-react';

export const AmbientSoundboard: React.FC = () => {
  const [droneVol, setDroneVol] = useState(0.0);
  const [stormVol, setStormVol] = useState(0.0);
  const [whisperVol, setWhisperVol] = useState(0.0);
  const [heartVol, setHeartVol] = useState(0.0);
  const [clockVol, setClockVol] = useState(0.0);
  const [isMuted, setIsMuted] = useState(false);

  const handleDroneChange = (v: number) => {
    setDroneVol(v);
    if (!isMuted) audioEngine.setDroneVolume(v);
  };

  const handleStormChange = (v: number) => {
    setStormVol(v);
    if (!isMuted) audioEngine.setStormVolume(v);
  };

  const handleWhisperChange = (v: number) => {
    setWhisperVol(v);
    if (!isMuted) audioEngine.setWhisperVolume(v);
  };

  const handleHeartChange = (v: number) => {
    setHeartVol(v);
    if (!isMuted) audioEngine.setHeartbeatVolume(v);
  };

  const handleClockChange = (v: number) => {
    setClockVol(v);
    if (!isMuted) audioEngine.setClockVolume(v);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioEngine.setDroneVolume(droneVol);
      audioEngine.setStormVolume(stormVol);
      audioEngine.setWhisperVolume(whisperVol);
      audioEngine.setHeartbeatVolume(heartVol);
      audioEngine.setClockVolume(clockVol);
      setIsMuted(false);
    } else {
      audioEngine.setDroneVolume(0);
      audioEngine.setStormVolume(0);
      audioEngine.setWhisperVolume(0);
      audioEngine.setHeartbeatVolume(0);
      audioEngine.setClockVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="bg-zinc-950/80 border border-red-900/60 rounded-xl p-3 md:p-4 backdrop-blur-md shadow-[0_0_20px_rgba(185,28,28,0.2)]">
      {/* Soundboard Header */}
      <div className="flex items-center justify-between mb-3 border-b border-red-950 pb-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold font-bangla text-zinc-100">
            ভৌতিক অ্যাম্বিয়েন্ট মিক্সার ও সাউন্ডবোর্ড
          </h3>
        </div>
        <button
          onClick={toggleMute}
          className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
            isMuted ? 'bg-red-800 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          {isMuted ? 'UNMUTE' : 'MUTE ALL'}
        </button>
      </div>

      {/* 5 Ambient Loops Slider Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {/* Drone */}
        <div className="bg-black/60 p-2.5 rounded-lg border border-red-950">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
            <span className="flex items-center gap-1">
              <Skull className="w-3 h-3 text-red-500" />
              সাব-বেস ড্রোন
            </span>
            <span className="text-[10px] text-zinc-500">{Math.round(droneVol * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={droneVol}
            onChange={(e) => handleDroneChange(parseFloat(e.target.value))}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>

        {/* Storm */}
        <div className="bg-black/60 p-2.5 rounded-lg border border-red-950">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
            <span className="flex items-center gap-1">
              <CloudLightning className="w-3 h-3 text-red-400" />
              ঝড়ের শোঁ-শোঁ
            </span>
            <span className="text-[10px] text-zinc-500">{Math.round(stormVol * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={stormVol}
            onChange={(e) => handleStormChange(parseFloat(e.target.value))}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>

        {/* Whispers */}
        <div className="bg-black/60 p-2.5 rounded-lg border border-red-950">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
            <span className="flex items-center gap-1">
              <Ghost className="w-3 h-3 text-red-400" />
              অশরীরী ফিসফিস
            </span>
            <span className="text-[10px] text-zinc-500">{Math.round(whisperVol * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={whisperVol}
            onChange={(e) => handleWhisperChange(parseFloat(e.target.value))}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>

        {/* Heartbeat */}
        <div className="bg-black/60 p-2.5 rounded-lg border border-red-950">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
            <span className="flex items-center gap-1">
              <HeartPulse className="w-3 h-3 text-red-500 animate-pulse" />
              হৃদস্পন্দন ধুকপুক
            </span>
            <span className="text-[10px] text-zinc-500">{Math.round(heartVol * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={heartVol}
            onChange={(e) => handleHeartChange(parseFloat(e.target.value))}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>

        {/* Death Clock */}
        <div className="bg-black/60 p-2.5 rounded-lg border border-red-950">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-400" />
              মৃত্যুর ঘড়ির টিক
            </span>
            <span className="text-[10px] text-zinc-500">{Math.round(clockVol * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={clockVol}
            onChange={(e) => handleClockChange(parseFloat(e.target.value))}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>
      </div>

      {/* One-Shot Horror Sound Effects Buttons */}
      <div>
        <div className="text-[11px] font-mono text-zinc-400 mb-2">
          তাত্ক্ষণিক ভৌতিক শব্দ (Instant Horror SFX):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            onClick={() => audioEngine.playSfx('thunder')}
            className="py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/70 rounded-lg text-xs font-bangla text-zinc-200 hover:text-white transition-all transform active:scale-95 shadow"
          >
            ⚡ বজ্রপাত
          </button>
          <button
            onClick={() => audioEngine.playSfx('scream')}
            className="py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/70 rounded-lg text-xs font-bangla text-zinc-200 hover:text-white transition-all transform active:scale-95 shadow"
          >
            😱 আর্তনাদ
          </button>
          <button
            onClick={() => audioEngine.playSfx('laugh')}
            className="py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/70 rounded-lg text-xs font-bangla text-zinc-200 hover:text-white transition-all transform active:scale-95 shadow"
          >
            😈 অট্টহাসি
          </button>
          <button
            onClick={() => audioEngine.playSfx('creak')}
            className="py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/70 rounded-lg text-xs font-bangla text-zinc-200 hover:text-white transition-all transform active:scale-95 shadow"
          >
            🚪 ক্যাঁচক্যাঁচ
          </button>
          <button
            onClick={() => audioEngine.playSfx('bone')}
            className="py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/70 rounded-lg text-xs font-bangla text-zinc-200 hover:text-white transition-all transform active:scale-95 shadow"
          >
            🦴 হাড় ভাঙা
          </button>
          <button
            onClick={() => audioEngine.playSfx('sigh')}
            className="py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/70 rounded-lg text-xs font-bangla text-zinc-200 hover:text-white transition-all transform active:scale-95 shadow"
          >
            🌬️ হিমেল শ্বাস
          </button>
        </div>
      </div>
    </div>
  );
};
